export interface Project {
  id: number;
  slug: string;
  title: string;
  year: string;
  client: string;
  role: string;
  image: string;
  summary: string;
  placeholder?: boolean; // not yet published — shown but not clickable
  description: string[];
  problemStatement: string;
  research: string;
  designProcess: string;
  keyDecisions: string[];
  outcome: string;
  learnings: string;
}

export const projects: Project[] = [
  {
    id: 6,
    slug: "triage-room",
    title: "TRIAGE ROOM",
    year: "2024",
    client: "Toyota × o9 Solutions",
    role: "Sole Product Designer",
    image: "/images/triage-room.jpg",
    summary: "Real-time supply chain exception management — replacing emails with a structured collaboration system used by 4,000+ supplier users.",
    description: [],
    problemStatement: "",
    research: "",
    designProcess: "",
    keyDecisions: [],
    outcome: "",
    learnings: "",
  },
  {
    id: 7,
    slug: "filter-system",
    title: "ALWAYS ON PANE",
    year: "2024",
    client: "o9 Solutions",
    role: "Sole Product Designer",
    image: "/images/always-on-pane.jpg",
    summary: "Three filter surfaces, five capability phases, one consistent data model — designing the system that power planners rely on.",
    description: [],
    problemStatement: "",
    research: "",
    designProcess: "",
    keyDecisions: [],
    outcome: "",
    learnings: "",
  },
  {
    id: 1,
    slug: "monolith",
    title: "MONOLITH",
    year: "2025",
    client: "Self-initiated",
    role: "Art Direction, Design",
    image: "https://picsum.photos/seed/monolith/1920/1080",
    summary: "Brutalist architecture through digital media — exploring how concrete forms translate into pixel structures.",
    placeholder: true,
    description: [],
    problemStatement: "",
    research: "",
    designProcess: "",
    keyDecisions: [],
    outcome: "",
    learnings: "",
  },
  {
    id: 2,
    slug: "void-protocol",
    title: "VOID PROTOCOL",
    year: "2024",
    client: "Redacted",
    role: "Creative Direction",
    image: "https://picsum.photos/seed/void/1920/1080",
    summary: "A classified editorial system designed for an institution that operates in deliberate obscurity.",
    placeholder: true,
    description: [],
    problemStatement: "",
    research: "",
    designProcess: "",
    keyDecisions: [],
    outcome: "",
    learnings: "",
  },
  {
    id: 3,
    slug: "vessel",
    title: "VESSEL",
    year: "2024",
    client: "Ceramic Atelier Mura",
    role: "Photography, Design",
    image: "https://picsum.photos/seed/vessel/1920/1080",
    summary: "Museum-quality product documentation for a ceramics studio producing exactly twelve pieces per year.",
    placeholder: true,
    description: [],
    problemStatement: "",
    research: "",
    designProcess: "",
    keyDecisions: [],
    outcome: "",
    learnings: "",
  },
  {
    id: 4,
    slug: "grid-collapse",
    title: "GRID COLLAPSE",
    year: "2023",
    client: "Institute of Digital Arts",
    role: "Installation, Code",
    image: "https://picsum.photos/seed/grid/1920/1080",
    summary: "A generative installation mapping structural failures of urban planning grids onto light sculptures.",
    placeholder: true,
    description: [],
    problemStatement: "",
    research: "",
    designProcess: "",
    keyDecisions: [],
    outcome: "",
    learnings: "",
  },
  {
    id: 5,
    slug: "night-corridor",
    title: "NIGHT CORRIDOR",
    year: "2023",
    client: "Infrastructure Bureau",
    role: "Aerial Photography",
    image: "https://picsum.photos/seed/night/1920/1080",
    summary: "An aerial survey of industrial corridors captured exclusively between 2:00 AM and 4:00 AM.",
    placeholder: true,
    description: [],
    problemStatement: "",
    research: "",
    designProcess: "",
    keyDecisions: [],
    outcome: "",
    learnings: "",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: Project | null; next: Project | null } {
  // Only navigate between published (non-placeholder) projects
  const published = projects.filter((p) => !p.placeholder);
  const index = published.findIndex((p) => p.slug === slug);
  return {
    prev: index > 0 ? published[index - 1] : null,
    next: index < published.length - 1 ? published[index + 1] : null,
  };
}
