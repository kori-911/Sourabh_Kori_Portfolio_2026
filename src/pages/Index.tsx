import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

import ContactDrawer from "@/components/ContactDrawer";
import ProjectCard from "@/components/ProjectCard";
import ScrambleText from "@/components/ScrambleText";
import PageWrapper from "@/components/PageWrapper";
import CertLightbox from "@/components/CertLightbox";

const skills = [
  { category: "Design & Strategy", items: ["Enterprise UX", "Systems Thinking", "AI Workflows", "Data Visualization", "Dashboard Architecture", "Interaction Design", "Design Systems"] },
  { category: "Research", items: ["User Interviews", "Contextual Inquiry", "Usability Testing", "Journey Mapping"] },
  { category: "Accessibility", items: ["WCAG 2.1", "Keyboard Accessibility", "ARIA Labels", "Color Contrast"] },
  { category: "Tools", items: ["Figma", "Sketch", "Adobe XD", "Framer", "Miro", "Illustrator", "After Effects"] },
];

const featuredProjects = projects.filter((p) => !p.placeholder);

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.5 },
};

const MORSE: Record<string, string> = {
  S:"...", O:"---", U:"..-", R:".-.", A:".-",
  B:"-...", H:"....", K:"-.-", I:"..", "#":"-.-.--"
};
const PHRASE = "SOURABH#KORI";
const morseString = PHRASE.split("").map(c => MORSE[c] || "").join(" ");

const MorseBackground = ({ paused }: { paused: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const rafRef = useRef<number>(0);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = morseString.repeat(6).split("");
    const DOT = 6, DASH = 18, GAP = 8, LINE_H = 28;
    const rows: { x: number; y: number; chars: string[]; speed: number }[] = [];

    let y = 20;
    while (y < 600) {
      const offset = Math.random() * -300;
      rows.push({
        x: offset,
        y,
        chars: [...chars],
        speed: 0.25 + Math.random() * 0.3,
      });
      y += LINE_H;
    }

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }

      ctx.clearRect(0, 0, W, H);

      rows.forEach(row => {
        if (!pausedRef.current) row.x -= row.speed;
        if (row.x < -W) row.x = W;

        let cx = row.x % W;
        row.chars.forEach(ch => {
          if (cx > W + 30) return;
          ctx.fillStyle = "rgba(255,255,255,0.12)";
          if (ch === ".") {
            ctx.beginPath();
            ctx.arc(cx + DOT / 2, row.y, DOT / 2, 0, Math.PI * 2);
            ctx.fill();
            cx += DOT + GAP;
          } else if (ch === "-") {
            ctx.fillRect(cx, row.y - 1.5, DASH, 3);
            cx += DASH + GAP;
          } else {
            cx += GAP * 2;
          }
        });
      });

      // Radial fade vignette
      const grad = ctx.createRadialGradient(W/2, H/2, H*0.1, W/2, H/2, H*0.9);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.92)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: paused ? 0.3 : 1, transition: "opacity 0.5s ease" }}
    />
  );
};

const Index = () => {
  const stats = [
    { value: "5 YRS", label: "Enterprise SaaS" },
    { value: "Fortune 100", label: "Client Scale" },
    { value: "NIFT", label: "Masters in Design" },
    { value: "Business Milestone", label: "Q4 2025 — SRM Platform", award: true, cert: "/assets/cert-q4-2025.pdf" },
    { value: "Business Milestone", label: "Q4 2024 — Always on Pane", award: true, cert: "/assets/cert-q4-2024.pdf" },
    { value: "Performer of the Quarter", label: "Q4 2023", award: true, cert: "/assets/cert-q4-2023.pdf" },
  ];

  const [statsHovered, setStatsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxCert, setLightboxCert] = useState<string | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (statsHovered) {
      if (tickerRef.current) clearInterval(tickerRef.current);
      return;
    }
    tickerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stats.length);
    }, 2000);
    return () => { if (tickerRef.current) clearInterval(tickerRef.current); };
  }, [statsHovered]);

  return (
    <PageWrapper className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center px-8 md:px-16 pt-24 pb-12">
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: "0",
            top: "50%",
            transform: "translateY(-50%)",
            width: "600px",
            height: "400px",
            background: "radial-gradient(ellipse at center, hsla(51, 100%, 50%, 0.07) 0%, transparent 70%)",
            zIndex: 0,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6">
              <ScrambleText text="SOURABH" /><br />
              <ScrambleText text="KORI" />
            </h1>
            <div className="h-px w-16 bg-primary mb-8" />
            <p className="font-display text-xl md:text-2xl text-foreground opacity-80 mb-4">
              Systems thinker. Enterprise UX.
            </p>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed max-w-xl mb-12">
              5 years designing for Fortune 100 supply chain software at o9 Solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/work" className="border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors">
                View Work
              </Link>
              <Link to="/about" className="border border-border px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                About Me
              </Link>
              <ContactDrawer buttonText="Contact" buttonClassName="border border-border px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground transition-colors cursor-pointer" />
            </div>
          </motion.div>

          <motion.div
            className="relative h-[500px] w-full hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* SVG grid background */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full text-muted-foreground opacity-40" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                </pattern>
                <rect width="400" height="500" fill="url(#grid)" />
              </svg>
            </div>

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-default"
              onMouseEnter={() => setStatsHovered(true)}
              onMouseLeave={() => setStatsHovered(false)}
              animate={{
                width: statsHovered ? 500 : 280,
                height: statsHovered ? 320 : 120,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden", position: "absolute" }}
            >
              <AnimatePresence mode="wait">
                {!statsHovered ? (
                  <motion.div
                    key={`collapsed-${activeIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-start justify-center w-full h-full px-2"
                  >
                    <span className="font-display text-3xl text-foreground leading-tight w-full">
                      {stats[activeIndex].value}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/60 mt-2 leading-snug">
                      {stats[activeIndex].label}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-3 grid-rows-2 gap-x-8 gap-y-8 px-4 py-4 w-full h-full"
                  >
                    {stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        className={`flex flex-col justify-center ${stat.award ? "cursor-pointer group" : ""}`}
                        onClick={() => stat.award && stat.cert ? setLightboxCert(stat.cert) : null}
                      >
                        <span className={`font-display text-lg leading-tight ${stat.award ? "text-primary group-hover:underline underline-offset-2" : "text-foreground"}`}>
                          {stat.value}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1 leading-snug">
                          {stat.label}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills / Stack */}
      <motion.section className="px-8 md:px-16 py-24 border-t border-border" {...fadeIn}>
        <span className="font-mono text-xs font-medium text-primary uppercase tracking-wider block mb-12">
          DESIGN STACK
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="font-display text-sm text-foreground mb-4">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="border border-border px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Featured Work */}
      <motion.section className="px-8 md:px-16 py-24 border-t border-border" {...fadeIn}>
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs font-medium text-primary uppercase tracking-wider block mb-4">
              SELECTED PROJECTS
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">FEATURED WORK</h2>
          </div>
          <Link
            to="/work"
            className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors hidden md:block"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} featured />
          ))}
        </div>
        <Link
          to="/work"
          className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors block mt-8 md:hidden"
        >
          View All Projects →
        </Link>
      </motion.section>

      {/* Contact CTA */}
      <section className="px-8 md:px-16 py-24 border-t border-border">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-xs font-medium text-primary uppercase tracking-wider block mb-8">
            LET'S CONNECT
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            INTERESTED IN WORKING TOGETHER?
          </h2>
          <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-8">
            I'm always open to discussing new projects, design challenges, or opportunities
            to collaborate. Drop me a line.
          </p>
          <ContactDrawer 
            buttonClassName="border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors inline-block cursor-pointer" 
          />
        </motion.div>
      </section>

      <CertLightbox cert={lightboxCert} onClose={() => setLightboxCert(null)} />
    </PageWrapper>
  );
};

export default Index;
