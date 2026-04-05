import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-background">
      <div className="text-center border border-border p-16">
        <h1 className="mb-4 text-6xl font-display text-foreground">404</h1>
        <p className="mb-8 text-sm font-mono text-muted-foreground uppercase tracking-wider">
          PATH NOT FOUND
        </p>
        <Link
          to="/"
          className="border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors inline-block"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
