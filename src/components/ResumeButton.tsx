import React, { useState, useEffect } from "react";

export default function ResumeButton() {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    fetch("/assets/PSourabhKori_Resume.pdf", { method: "HEAD" })
      .then((response) => {
        if (!response.ok) {
          setIsAvailable(false);
        }
      })
      .catch(() => {
        setIsAvailable(false);
      });
  }, []);

  if (!isAvailable) {
    return (
      <button
        disabled
        className="border border-border bg-background text-muted-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider inline-block text-center cursor-not-allowed"
      >
        Resume not available
      </button>
    );
  }

  return (
    <a
      href="/assets/PSourabhKori_Resume.pdf"
      download="PSourabhKori_Resume.pdf"
      className="border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors inline-block text-center cursor-pointer"
    >
      Download Resume
    </a>
  );
}
