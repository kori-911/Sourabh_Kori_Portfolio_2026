import { useParams, Navigate, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ReadingProgress from "@/components/ReadingProgress";
import CaseStudyNav from "@/components/CaseStudyNav";
import NextSteps from "@/components/NextSteps";
import ScrambleText from "@/components/ScrambleText";
import PageWrapper from "@/components/PageWrapper";
import { getProjectBySlug, getAdjacentProjects } from "@/data/projects";

const Section = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
  <motion.section
    id={id}
    className="mb-20 scroll-mt-24"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5 }}
  >
    <span className="font-mono text-xs font-medium text-primary uppercase tracking-wider block mb-6">{label}</span>
    {children}
  </motion.section>
);

const CaseStudy = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const adjacent = slug ? getAdjacentProjects(slug) : { prev: null, next: null };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <Navigate to="/work" replace />;

  return (
    <PageWrapper className="bg-background relative">
      <ReadingProgress />
      <CaseStudyNav />

      {/* Hero */}
      <div className="w-full h-[70vh] relative border-b border-border">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-12 left-8 md:left-16">
          <Link
            to="/work"
            className="font-mono text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors block mb-6"
          >
            ← Back to Work
          </Link>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-4">
            <ScrambleText text={project.title} />
          </h1>
          <div className="h-px w-16 bg-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 lg:px-0 lg:ml-40 lg:mr-auto pt-16 pb-24">
        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-8 mb-20">
          <div>
            <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Year</span>
            <span className="font-mono text-sm text-foreground">{project.year}</span>
          </div>
          <div>
            <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Client</span>
            <span className="font-mono text-sm text-foreground">{project.client}</span>
          </div>
          <div>
            <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Role</span>
            <span className="font-mono text-sm text-foreground">{project.role}</span>
          </div>
        </div>

        {/* Overview */}
        <Section id="overview" label="Overview">
          {project.description.map((p, i) => (
            <p key={i} className="font-mono text-sm text-foreground leading-relaxed mb-6 opacity-80">{p}</p>
          ))}
        </Section>

        {/* Problem */}
        <Section id="problem" label="Problem Statement">
          <p className="font-mono text-sm text-foreground leading-relaxed opacity-80">{project.problemStatement}</p>
        </Section>

        {/* Role */}
        <Section id="role" label="My Role">
          <p className="font-display text-2xl text-foreground">{project.role}</p>
          <p className="font-mono text-xs text-muted-foreground mt-2">{project.client} — {project.year}</p>
        </Section>

        {/* Research */}
        <Section id="research" label="Research & Discovery">
          <p className="font-mono text-sm text-foreground leading-relaxed opacity-80">{project.research}</p>
        </Section>

        {/* Process */}
        <Section id="process" label="Design Process">
          <p className="font-mono text-sm text-foreground leading-relaxed opacity-80">{project.designProcess}</p>
        </Section>

        {/* Key Decisions */}
        <Section id="decisions" label="Key UX Decisions">
          <div className="space-y-4">
            {project.keyDecisions.map((decision, i) => (
              <div key={i} className="flex gap-4 items-start border-l border-border pl-6">
                <span className="font-mono text-xs text-primary flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-mono text-sm text-foreground opacity-80">{decision}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Final Screens */}
        <Section id="screens" label="Final Screens">
          <div className="border border-dashed border-border p-12 flex items-center justify-center aspect-[16/9] bg-muted/10">
            <p className="font-mono text-sm text-muted-foreground text-center">
              [Project screens — add 2–3 annotated screenshots here]
            </p>
          </div>
        </Section>

        {/* Outcome */}
        <Section id="outcome" label="Outcome & Impact">
          <p className="font-mono text-sm text-foreground leading-relaxed opacity-80">{project.outcome}</p>
        </Section>

        {/* Learnings */}
        <Section id="learnings" label="Learnings">
          <blockquote className="border-l-2 border-primary pl-6">
            <p className="font-mono text-sm text-foreground leading-relaxed italic opacity-80">{project.learnings}</p>
          </blockquote>
        </Section>

        {/* Next Steps */}
        <NextSteps prev={adjacent.prev} next={adjacent.next} />
      </div>
    </PageWrapper>
  );
};

export default CaseStudy;
