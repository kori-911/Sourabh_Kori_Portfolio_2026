import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, featured }) => {
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setLightPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const delayMultiplier = featured ? 0.15 : 0.1;

  // ── Shared image block ───────────────────────────────────────────────────
  const imageBlock = (
    <div
      ref={cardRef}
      className={`relative aspect-[4/3] border border-border overflow-hidden mb-4 ${
        project.placeholder ? "opacity-40 grayscale" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      {!project.placeholder && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
          style={{
            background: hovered
              ? `radial-gradient(circle 250px at ${lightPos.x}% ${lightPos.y}%, transparent 0%, hsl(var(--background)) 100%)`
              : `linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 50%, hsl(var(--background) / 0.4) 100%)`,
          }}
        />
      )}
      {project.placeholder && (
        <div className="absolute inset-0 bg-background/60 flex items-end p-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Coming soon
          </span>
        </div>
      )}
      <div className="absolute top-4 left-4">
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );

  // ── Shared metadata block ────────────────────────────────────────────────
  const metaBlock = (
    <div className={`flex items-start justify-between gap-4 ${project.placeholder ? "opacity-40" : ""}`}>
      <div>
        <h3
          className={`font-display text-lg text-foreground transition-colors ${
            project.placeholder ? "" : "group-hover:text-primary"
          }`}
        >
          {project.title}
        </h3>
        <p className="font-mono text-xs text-muted-foreground mt-1">{project.summary}</p>
      </div>
      {featured ? (
        <span className="font-mono text-xs text-muted-foreground flex-shrink-0">{project.role}</span>
      ) : (
        <div className="flex-shrink-0 text-right">
          <span className="font-mono text-xs text-muted-foreground block">{project.year}</span>
          <span className="font-mono text-xs text-muted-foreground block mt-1">{project.role}</span>
        </div>
      )}
    </div>
  );

  // ── Shared bottom rule ───────────────────────────────────────────────────
  const rule = (
    <motion.div
      className={`h-px mt-4 ${project.placeholder ? "bg-border" : "bg-primary"}`}
      initial={{ width: "0%" }}
      whileInView={{ width: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * delayMultiplier + 0.2 }}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * delayMultiplier }}
    >
      {project.placeholder ? (
        // Non-clickable placeholder — cursor blocked, no hover states
        <div className="cursor-default">
          {imageBlock}
          {metaBlock}
          {rule}
        </div>
      ) : (
        // Published project — full interactive card
        <Link to={`/work/${project.slug}`} className="group block">
          {imageBlock}
          {metaBlock}
          {rule}
        </Link>
      )}
    </motion.div>
  );
};

export default ProjectCard;
