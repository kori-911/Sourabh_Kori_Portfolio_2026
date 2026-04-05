import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SectionData {
  id: string;
  label: string;
  top: number;
}

export function useScrollSpy() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const updateSections = () => {
      const els = Array.from(document.querySelectorAll("[data-section]")) as HTMLElement[];
      setSections(
        els.map((el) => ({
          id: el.id,
          label: el.getAttribute("data-section") || el.id,
          top: el.offsetTop,
        }))
      );
    };

    // Slight delay to allow rendering/images to load
    const timeoutId = setTimeout(updateSections, 150);
    
    // Also update on resize
    window.addEventListener("resize", updateSections);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateSections);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate overall progress
      const totalScrollable = documentHeight - windowHeight;
      const currentProgress = totalScrollable > 0 ? Math.min(Math.max(scrollY / totalScrollable, 0), 1) : 0;
      setProgress(currentProgress);

      // Determine active section
      const els = Array.from(document.querySelectorAll("[data-section]")) as HTMLElement[];
      let current = "";
      
      // If we are at the very bottom, highlight the last section
      if (scrollY + windowHeight >= documentHeight - 10) {
        if (els.length > 0) {
          current = els[els.length - 1].id;
        }
      } else {
        for (const el of els) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is above the middle of the viewport
          if (rect.top <= windowHeight / 2) {
            current = el.id;
          }
        }
      }
      
      if (!current && els.length > 0) {
        current = els[0].id;
      }
      
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, sections]);

  return { sections, activeSection, progress };
}
