import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/scroll";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "role", label: "Role" },
  { id: "research", label: "Research" },
  { id: "process", label: "Process" },
  { id: "decisions", label: "Decisions" },
  { id: "screens", label: "Screens" },
  { id: "outcome", label: "Outcome" },
  { id: "learnings", label: "Learnings" },
];

const CaseStudyNav = () => {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
      <nav className="flex flex-col gap-4 border-r border-border pr-4">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id, 100)}
            className={`text-right font-mono text-xs font-medium uppercase tracking-wider transition-colors ${
              activeSection === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CaseStudyNav;
