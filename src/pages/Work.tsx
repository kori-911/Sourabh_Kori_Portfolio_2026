import React from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ScrambleText from "@/components/ScrambleText";
import PageWrapper from "@/components/PageWrapper";

const published = projects.filter((p) => !p.placeholder);
const placeholderCount = projects.filter((p) => p.placeholder).length;

// Show 2 skeleton slots to represent the coming-soon work
const SKELETON_SLOTS = Math.min(placeholderCount, 2);

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: (published.length + index) * 0.1 }}
  >
    <div className="aspect-[4/3] border border-border/40 border-dashed mb-4 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
      {/* subtle animated shimmer lines */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 px-8 opacity-[0.06]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-px bg-foreground w-full" />
        ))}
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
        Case study in progress
      </span>
    </div>
    <div className="flex items-start justify-between gap-4 opacity-30">
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-foreground/10 w-2/5 rounded-none" />
        <div className="h-2 bg-foreground/10 w-4/5 rounded-none" />
        <div className="h-2 bg-foreground/10 w-3/5 rounded-none" />
      </div>
      <div className="flex-shrink-0 space-y-2 text-right">
        <div className="h-2 bg-foreground/10 w-8 rounded-none" />
        <div className="h-2 bg-foreground/10 w-16 rounded-none" />
      </div>
    </div>
    <div className="h-px bg-border/30 mt-4" />
  </motion.div>
);

const Work = () => (
  <PageWrapper className="bg-background">
    <div className="max-w-5xl mx-auto px-8 pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl md:text-6xl text-foreground mb-4">
          <ScrambleText text="WORK" />
        </h1>
        <div className="h-px w-16 bg-primary mb-4" />
        <p className="font-mono text-xs text-muted-foreground mb-16">
          {String(published.length).padStart(2, "0")} PROJECTS &nbsp;·&nbsp; {placeholderCount} COMING SOON
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Published projects */}
        {published.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}

        {/* Coming-soon skeleton slots */}
        {[...Array(SKELETON_SLOTS)].map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} index={i} />
        ))}
      </div>

      {/* Bottom label */}
      {placeholderCount > 0 && (
        <motion.p
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40 text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          More work being documented — check back soon
        </motion.p>
      )}
    </div>
  </PageWrapper>
);

export default Work;
