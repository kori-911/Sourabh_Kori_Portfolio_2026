const RESUME_URL =
  "https://drive.google.com/uc?export=download&id=1t_AG0uXfbHvaQ9-oL5X1vF3pqUJdUNuu";

export default function ResumeButton() {
  return (
    <a
      href={RESUME_URL}
      download="PSourabhKori_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors inline-block text-center cursor-pointer"
    >
      Download Resume
    </a>
  );
}
