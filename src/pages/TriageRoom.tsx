import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ReadingProgress from "@/components/ReadingProgress";
import NextSteps from "@/components/NextSteps";
import { getAdjacentProjects } from "@/data/projects";
import ContactDrawer from "@/components/ContactDrawer";

const adjacent = getAdjacentProjects("triage-room");

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

// ─── Primitive components ──────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-4">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight mb-5">
      {children}
    </h2>
  );
}

function Rule() {
  return <div className="h-px w-full bg-border mb-10" />;
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-sm text-muted-foreground leading-[1.85] mb-5 max-w-3xl">
      {children}
    </p>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l border-primary pl-5 py-1 my-8 max-w-2xl">
      <p className="font-mono text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-12 py-10 border-t border-b border-border">
      <span className="font-display text-[80px] text-primary leading-none block -mb-6 opacity-50 select-none">
        "
      </span>
      <p className="font-display text-2xl md:text-3xl text-foreground leading-snug max-w-3xl">
        {children}
      </p>
    </div>
  );
}

function StatRow({ items }: { items: { num: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border my-10">
      {items.map(({ num, label }) => (
        <div key={num} className="bg-background px-6 py-8">
          <span className="font-display text-4xl text-primary block leading-none mb-3">{num}</span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest leading-snug whitespace-pre-line">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function ContribGrid({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mt-8">
      {items.map(({ title, desc }) => (
        <div key={title} className="flex gap-4">
          <div className="w-px bg-primary/40 flex-shrink-0 mt-1" />
          <div>
            <p className="font-mono text-xs font-medium text-foreground mb-1.5">{title}</p>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Decision({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-6 mb-8 last:mb-0 max-w-3xl">
      <span className="font-mono text-[11px] text-primary mt-0.5">{n}</span>
      <div>
        <p className="font-mono text-xs font-medium text-foreground mb-2">{title}</p>
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({ num, eyebrow, title, children }: {
  num: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section className="relative mb-24" {...fadeUp}>
      {/* Ghost number watermark */}
      <span
        className="absolute -top-10 right-0 font-display leading-none text-foreground select-none pointer-events-none"
        style={{ fontSize: "clamp(80px, 12vw, 160px)", opacity: 0.04 }}
        aria-hidden
      >
        {num}
      </span>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle>{title}</SectionTitle>
      <Rule />
      {children}
    </motion.section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TriageRoom() {
  return (
    <PageWrapper className="bg-background">
      <ReadingProgress />

      <div className="max-w-5xl mx-auto px-8 pt-28 pb-28">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.div
          className="pb-20 mb-20 border-b border-border"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link
            to="/work"
            className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors inline-block mb-14"
          >
            ← Work
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {["Supply Chain", "Collaboration", "Toyota", "o9 Platform", "2023 – 2024"].map((t) => (
              <span key={t} className="font-mono text-[10px] text-muted-foreground border border-border px-3 py-1 uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>

          <h1 className="font-display text-6xl md:text-8xl text-foreground leading-[0.95] tracking-tight mb-8">
            Triage<br />Room
          </h1>

          <p className="font-mono text-sm text-muted-foreground leading-[1.85] max-w-2xl">
            A collaborative crisis resolution workspace designed for Toyota's North American
            supply chain — enabling suppliers and OEMs to resolve shortages faster, with less
            context switching and structured accountability.
          </p>

          {/* Metadata strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 pt-10 border-t border-border">
            {[
              { label: "Role", value: "Sole Product Designer" },
              { label: "Timeline", value: "Jul 2023 → Dec 2024" },
              { label: "Client", value: "Toyota Motor North America" },
              { label: "Platform", value: "o9 Digital Brain (SaaS)" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
                <p className="font-mono text-xs text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Sections ──────────────────────────────────────────────────── */}

        <Section num="01" eyebrow="01 — The Problem" title="Supply shortages had no single home">
          <Body>
            Crisis resolution at Toyota happened across a fragmented stack of tools — emails, phone
            calls, and spreadsheets — with no audit trail, no shared workspace, and no structured
            way to open, track, or close a shortage event.
          </Body>
          <Body>
            Suppliers and Toyota's NAMCs had no place to track shortages, commitments, and impacts
            in real time. Critical structured data — run-out quantities, NAMC impact, supply gaps —
            lived outside the conversation, causing repeated context switching and post-crisis
            reporting gaps.
          </Body>
          <Callout>
            o9 had the primitives (Pulse, Tasks), but no purpose-built surface for supply crisis
            management. Toyota needed this inside their existing workflows — not another standalone
            tool.
          </Callout>
        </Section>

        <Section num="02" eyebrow="02 — The Solution" title="A purpose-built crisis workspace inside o9">
          <Body>
            Triage Room brings all the moving parts of a shortage event into one structured,
            auditable space. A Pulse-first collaboration feed keeps conversation central — tasks and
            forms become supporting elements, not the main view.
          </Body>
          <Body>
            Structured data tabs (run-out quantities, supply gap analysis, NAMC impact) sit alongside
            the conversation. Rooms have a defined lifecycle: opened, managed, formally closed.
          </Body>
          <PullQuote>
            Crisis resolution is a conversation, not a task list — the design had to reflect that.
          </PullQuote>
        </Section>

        <Section num="03" eyebrow="03 — My Contribution" title="End-to-end design ownership">
          <Body>
            Solo designer from July 2023 through ship in 2024. Discovery, concept, stakeholder
            reviews, system strategy, role-based access, and data architecture — all of it.
          </Body>
          <ContribGrid
            items={[
              { title: "Discovery & requirements", desc: "Synthesized Toyota's operational constraints, o9 platform capabilities, and engineering capacity into a coherent design brief" },
              { title: "Concept to shipped", desc: "Led design from Phase 1 wireframes through 3 full review cycles to final shipped product — solo designer throughout" },
              { title: "Stakeholder alignment", desc: "Facilitated cross-functional reviews with Toyota, NAMCs, product, and engineering — translating feedback into design pivots" },
              { title: "System reuse strategy", desc: "Redesigned Phase 1 to use composable o9 components — cutting engineering effort by ~40% vs. custom-built widgets" },
              { title: "Role-based access design", desc: "Designed ACL rules for supplier vs. OEM write permissions, closed-state behaviors, and read-only enforcement" },
              { title: "Data architecture", desc: "Designed parent-child pivot tables for run-out data, replacing flat tables to support both aggregated OEM and granular supplier views" },
            ]}
          />
        </Section>

        <Section num="04" eyebrow="04 — Key Design Decisions" title="How the big pivots were made">
          <Decision n="1." title="Task-centric → Collaboration-first" desc="Phase 1 was a project management tool. After stakeholder feedback, Pulse became the primary surface — tasks and forms became supporting elements, not the main view." />
          <Decision n="2." title="Custom widgets → Composable platform components" desc="Switched from bespoke form/grid widgets to reusing existing o9 components, reducing engineering scope significantly and ensuring platform consistency." />
          <Decision n="3." title="Flat table → Parent-child pivot" desc="Run-out data needed two lenses simultaneously — aggregated for Toyota, granular for suppliers. A pivot with drill-down solved both without duplication." />
          <Decision n="4." title="Placeholder tabs → Impact Analysis tab" desc="Replaced vague 'Custom Report' tabs with a purpose-built Impact Analysis tab showing Forecast vs. Commit charts — the data that triggered the room in the first place." />
        </Section>

        <Section num="05" eyebrow="05 — Outcome" title="A success story for o9">
          <Body>
            Shipped into Toyota's o9 environment in 2024. Three full stakeholder review cycles
            completed and approved. One unified workspace replaced fragmented email and spreadsheet
            workflows for 4,000+ supplier users.
          </Body>
          <StatRow
            items={[
              { num: "~40%", label: "Engineering effort\nreduced" },
              { num: "3", label: "Stakeholder review\ncycles approved" },
              { num: "4K+", label: "Supplier users\nat launch" },
              { num: "Live", label: "Shipped in Toyota's\no9 environment" },
            ]}
          />
          <Callout>
            Triage Room became a flagship example of how o9 can extend its collaboration primitives
            into purpose-built industry workflows — setting a template for future vertical solutions
            on the platform.
          </Callout>
        </Section>

        {/* ── Connect CTA ───────────────────────────────────────────────── */}
        <motion.div
          className="border-t border-border pt-20 mb-20"
          {...fadeUp}
        >
          <p className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-6">
            Full case study
          </p>
          <p className="font-display text-3xl md:text-4xl text-foreground leading-tight mb-3 max-w-xl">
            Curious to see how it all came together?
          </p>
          <p className="font-display text-3xl md:text-4xl text-primary leading-tight mb-10 max-w-xl">
            Let's connect.
          </p>
          <ContactDrawer
            buttonText="Get in touch →"
            buttonClassName="font-mono text-xs text-primary border border-primary px-8 py-4 uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer inline-block"
          />
        </motion.div>

        {/* ── Next / Prev ───────────────────────────────────────────────── */}
        <NextSteps prev={adjacent.prev} next={adjacent.next} />
      </div>
    </PageWrapper>
  );
}
