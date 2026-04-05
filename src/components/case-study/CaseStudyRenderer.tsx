import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ReadingProgress from "@/components/ReadingProgress";
import NextSteps from "@/components/NextSteps";
import { getAdjacentProjects } from "@/data/projects";
import { scrollToSection } from "@/lib/scroll";
import { parseCaseStudy, type ParsedCaseStudy, type ParsedSection } from "@/lib/case-study-parser";
import BlockRenderer from "./BlockRenderer";

const CONTAINER = "px-5 sm:px-8 md:px-[8%] lg:px-[14%] xl:px-[16%]";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  section,
  isDark,
}: {
  section: ParsedSection;
  isDark?: boolean;
}) {
  const inner = (
    <motion.section
      id={section.id}
      className="mb-28 scroll-mt-28"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-mono text-[11px] font-medium text-primary uppercase tracking-widest block mb-5">
        {section.label}
      </span>
      {section.blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </motion.section>
  );

  if (isDark) {
    return (
      <div className="bg-muted/20 border-y border-border">
        <div className={`${CONTAINER} py-24`}>{inner}</div>
      </div>
    );
  }

  return inner;
}

// ─── Scroll nav ───────────────────────────────────────────────────────────────

function CaseStudyNav({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  // Build short label (everything after the em dash if present, else first word)
  function shortLabel(label: string) {
    const parts = label.split("—");
    return parts.length > 1 ? parts[1].trim() : label.split(" ")[0];
  }

  return (
    <div className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
      <nav className="flex flex-col gap-3 border-r border-border pr-4">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id, 100)}
            className={`text-right font-mono text-[10px] font-medium uppercase tracking-wider transition-colors ${
              activeSection === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {shortLabel(label)}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── Loading / Error states ───────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className={`${CONTAINER} pt-48 pb-28 min-h-screen flex items-center`}>
      <p className="font-mono text-sm text-muted-foreground animate-pulse">Loading case study…</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className={`${CONTAINER} pt-48 pb-28 min-h-screen`}>
      <p className="font-mono text-sm text-primary mb-4">Failed to load case study</p>
      <p className="font-mono text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ data }: { data: ParsedCaseStudy }) {
  const { meta } = data;
  return (
    <div className={`${CONTAINER} pt-28 pb-20 border-b border-border`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to="/work"
          className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors inline-block mb-12"
        >
          ← Back to Work
        </Link>
        <p className="font-mono text-[11px] text-primary uppercase tracking-widest mb-5">
          {meta.eyebrow}
        </p>
        <h1
          className="font-display text-4xl md:text-6xl text-foreground mb-8 leading-[1.05]"
          dangerouslySetInnerHTML={{ __html: meta.title }}
        />
        <p className="font-mono text-sm text-foreground/60 leading-relaxed mb-16">
          {meta.subtitle}
        </p>
        {meta.metadata.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-8 border-t border-border pt-10">
            {meta.metadata.map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  {label}
                </p>
                <p className="font-mono text-xs text-foreground">{value}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Main renderer ────────────────────────────────────────────────────────────

interface Props {
  slug: string;
}

export default function CaseStudyRenderer({ slug }: Props) {
  const [data, setData] = useState<ParsedCaseStudy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const adjacent = getAdjacentProjects(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Use import.meta.env.BASE_URL so the fetch works on any deploy path
    fetch(`${import.meta.env.BASE_URL}case-studies/${slug}.html`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((html) => setData(parseCaseStudy(html)))
      .catch((err) => setError(String(err)));
  }, [slug]);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const navSections = data.sections.map(({ id, label }) => ({ id, label }));
  const mainSections = data.sections.filter((s) => s.type !== "dark");
  const darkSections = data.sections.filter((s) => s.type === "dark");

  // Sections that appear before any dark section
  const firstDarkIndex = data.sections.findIndex((s) => s.type === "dark");
  const beforeDark = firstDarkIndex >= 0 ? data.sections.slice(0, firstDarkIndex) : data.sections;
  const afterDark  = firstDarkIndex >= 0 ? data.sections.slice(firstDarkIndex + 1) : [];
  const darkSection = firstDarkIndex >= 0 ? data.sections[firstDarkIndex] : null;

  return (
    <PageWrapper className="bg-background">
      <ReadingProgress />
      <CaseStudyNav sections={navSections} />
      <Hero data={data} />

      {/* Sections before dark treatment */}
      <div className={`${CONTAINER} pt-24 pb-8`}>
        {beforeDark.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </div>

      {/* Dark full-bleed section */}
      {darkSection && <Section key={darkSection.id} section={darkSection} isDark />}

      {/* Sections after dark treatment */}
      {afterDark.length > 0 && (
        <div className={`${CONTAINER} pt-24 pb-28`}>
          {afterDark.map((section) => (
            <Section key={section.id} section={section} />
          ))}
          <NextSteps prev={adjacent.prev} next={adjacent.next} />
        </div>
      )}

      {/* NextSteps when dark section is last (no afterDark) or no dark section at all */}
      {afterDark.length === 0 && (
        <div className={`${CONTAINER} pb-28 pt-16`}>
          <NextSteps prev={adjacent.prev} next={adjacent.next} />
        </div>
      )}
    </PageWrapper>
  );
}
