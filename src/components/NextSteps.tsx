import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import RulerCarousel, { ComingSoonItem, CarouselItem } from "./RulerCarousel";

interface NextStepsProps {
  currentSlug: string;
}

const NextSteps = ({ currentSlug }: NextStepsProps) => {
  // All published (non-placeholder) projects except the one we're currently viewing
  const otherProjects = projects.filter(
    (p) => !p.placeholder && p.slug !== currentSlug
  );

  // Build carousel items: real projects first, then coming-soon pads
  // Minimum 2 slots so the carousel always has something to show
  const MIN_SLOTS = 2;
  const comingSoonPads: ComingSoonItem[] = Array.from(
    { length: Math.max(0, MIN_SLOTS - otherProjects.length) },
    (_, i) => ({ id: `cs-pad-${i}`, type: "coming-soon" as const })
  );

  const carouselItems: CarouselItem[] = [...otherProjects, ...comingSoonPads];

  return (
    <div className="mt-32 border-t border-border pt-16">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] block mb-3">
            CONTINUE EXPLORING
          </span>
          <p className="font-mono text-xs text-muted-foreground/60">
            {otherProjects.length > 0
              ? `${otherProjects.length} more case ${otherProjects.length === 1 ? "study" : "studies"}`
              : "More case studies coming soon"}
          </p>
        </div>
        <Link
          to="/work"
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          All Work →
        </Link>
      </div>

      <RulerCarousel items={carouselItems} />
    </div>
  );
};

export default NextSteps;
