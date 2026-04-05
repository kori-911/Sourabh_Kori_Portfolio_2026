import { Link } from "react-router-dom";
import { Project } from "@/data/projects";
import ContactDrawer from "@/components/ContactDrawer";

interface NextStepsProps {
  prev: Project | null;
  next: Project | null;
}

const NextSteps = ({ prev, next }: NextStepsProps) => {
  return (
    <div className="mt-32 border-t border-border pt-16">
      <span className="font-mono text-xs font-medium text-primary uppercase tracking-wider block mb-12 text-center">
        CONTINUE EXPLORING
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Previous Project */}
        {prev ? (
          <Link
            to={`/work/${prev.slug}`}
            className="group block border border-border p-8 hover:border-foreground transition-colors"
          >
            <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-4">
              ← Previous Project
            </span>
            <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors mb-2">
              {prev.title}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">{prev.summary}</p>
          </Link>
        ) : (
          <div className="border border-border p-8 opacity-50 flex flex-col justify-center">
            <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block">
              Start of Archive
            </span>
          </div>
        )}

        {/* Next Project */}
        {next ? (
          <Link
            to={`/work/${next.slug}`}
            className="group block border border-border p-8 hover:border-foreground transition-colors text-right"
          >
            <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-4">
              Next Project →
            </span>
            <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors mb-2">
              {next.title}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">{next.summary}</p>
          </Link>
        ) : (
          <div className="border border-border p-8 opacity-50 flex flex-col justify-center text-right">
            <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block">
              End of Archive
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/work"
          className="border border-border px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-foreground transition-colors text-center"
        >
          Explore All Work
        </Link>
        <ContactDrawer 
          buttonText="Get in Touch"
          buttonClassName="border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors text-center cursor-pointer"
        />
      </div>
    </div>
  );
};

export default NextSteps;
