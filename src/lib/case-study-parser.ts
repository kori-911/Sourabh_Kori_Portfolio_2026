// ─── Block Types ──────────────────────────────────────────────────────────────

export interface ParagraphBlock { type: "paragraph"; html: string }
export interface HeadingBlock { type: "heading"; level: 2 | 3 | 4; text: string }
export interface CalloutBlock { type: "callout"; text: string }
export interface TagsBlock { type: "tags"; items: string[] }

export interface GridCard {
  badge?: string;
  title?: string;
  list: string[];
}
export interface GridBlock {
  type: "grid";
  cols?: 2 | 3;
  cards: GridCard[];
}

export interface StatItem { value: string; label: string }
export interface StatsBlock { type: "stats"; items: StatItem[] }

export interface TimelineEntry {
  date: string;
  title: string;
  body: string;
  tags?: string[];
}
export interface TimelineBlock { type: "timeline"; entries: TimelineEntry[] }

export interface DecisionItem {
  num?: string;
  q: string;
  a: string;
  tags?: string[];
}
export interface DecisionsBlock { type: "decisions"; items: DecisionItem[] }

export interface ProcessStep {
  num: string;
  title: string;
  body: string;
}
export interface ProcessBlock { type: "process"; steps: ProcessStep[] }

export interface ComparisonPhase {
  label: string;
  variant?: "default" | "success";
  items: string[];
}
export interface ComparisonBlock { type: "comparison"; phases: ComparisonPhase[] }

export interface ScreenItem {
  num: string;
  title: string;
  body: string;
  wide?: boolean;
}
export interface ScreensBlock { type: "screens"; items: ScreenItem[] }

export interface TableRow { cells: string[]; accentLast?: boolean }
export interface TableBlock { type: "table"; headers: string[]; rows: TableRow[] }

export type Block =
  | ParagraphBlock
  | HeadingBlock
  | CalloutBlock
  | TagsBlock
  | GridBlock
  | StatsBlock
  | TimelineBlock
  | DecisionsBlock
  | ProcessBlock
  | ComparisonBlock
  | ScreensBlock
  | TableBlock;

// ─── Parsed structure ─────────────────────────────────────────────────────────

export interface MetaField { label: string; value: string }

export interface ParsedMeta {
  title: string;
  eyebrow: string;
  subtitle: string;
  metadata: MetaField[];
}

export interface ParsedSection {
  id: string;
  label: string;
  type?: "dark";
  blocks: Block[];
}

export interface ParsedCaseStudy {
  meta: ParsedMeta;
  sections: ParsedSection[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function metaContent(doc: Document, name: string): string {
  return doc.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ?? "";
}

function extractTags(el: Element): string[] {
  return Array.from(el.querySelectorAll("li")).map((li) => li.textContent?.trim() ?? "");
}

function parseGrid(el: Element): GridBlock {
  const colsAttr = el.getAttribute("data-cols");
  const cols = colsAttr === "3" ? 3 : colsAttr === "2" ? 2 : undefined;
  const cards: GridCard[] = Array.from(el.querySelectorAll(":scope > article")).map((card) => {
    const h4 = card.querySelector("h4");
    const badge = h4?.getAttribute("data-badge") ?? undefined;
    const title = h4?.textContent?.trim();
    const listItems = Array.from(card.querySelectorAll("ul:not([data-tags]) > li")).map(
      (li) => li.textContent?.trim() ?? ""
    );
    return { badge, title: title ?? undefined, list: listItems };
  });
  return { type: "grid", cols, cards };
}

function parseStats(el: Element): StatsBlock {
  const items: StatItem[] = Array.from(el.querySelectorAll("dl > dt")).map((dt) => ({
    value: dt.textContent?.trim() ?? "",
    label: dt.nextElementSibling?.textContent?.trim() ?? "",
  }));
  return { type: "stats", items };
}

function parseTimeline(el: Element): TimelineBlock {
  const entries: TimelineEntry[] = Array.from(el.querySelectorAll(":scope > article")).map((art) => {
    const tagsList = art.querySelector("[data-tags]");
    const tags = tagsList ? extractTags(tagsList) : undefined;
    return {
      date: art.getAttribute("data-date") ?? "",
      title: art.querySelector("h4")?.textContent?.trim() ?? "",
      body: art.querySelector("p")?.textContent?.trim() ?? "",
      tags: tags?.length ? tags : undefined,
    };
  });
  return { type: "timeline", entries };
}

function parseDecisions(el: Element): DecisionsBlock {
  const items: DecisionItem[] = Array.from(el.querySelectorAll(":scope > article")).map((art, i) => {
    const tagsList = art.querySelector("[data-tags]");
    const tags = tagsList ? extractTags(tagsList) : undefined;
    return {
      num: art.getAttribute("data-num") ?? String(i + 1).padStart(2, "0"),
      q: art.querySelector("h4")?.textContent?.trim() ?? "",
      a: art.querySelector("p")?.textContent?.trim() ?? "",
      tags: tags?.length ? tags : undefined,
    };
  });
  return { type: "decisions", items };
}

function parseProcess(el: Element): ProcessBlock {
  const steps: ProcessStep[] = Array.from(el.querySelectorAll(":scope > article")).map((art, i) => ({
    num: art.getAttribute("data-num") ?? String(i + 1),
    title: art.querySelector("h4")?.textContent?.trim() ?? "",
    body: art.querySelector("p")?.textContent?.trim() ?? "",
  }));
  return { type: "process", steps };
}

function parseComparison(el: Element): ComparisonBlock {
  const phases: ComparisonPhase[] = Array.from(el.querySelectorAll(":scope > article")).map((art) => ({
    label: art.getAttribute("data-label") ?? "",
    variant: (art.getAttribute("data-variant") as "default" | "success") ?? "default",
    items: Array.from(art.querySelectorAll("li")).map((li) => li.textContent?.trim() ?? ""),
  }));
  return { type: "comparison", phases };
}

function parseTable(el: Element): TableBlock {
  const headers = Array.from(el.querySelectorAll("thead th")).map((th) => th.textContent?.trim() ?? "");
  const rows: TableRow[] = Array.from(el.querySelectorAll("tbody tr")).map((tr) => {
    const accentLast = tr.querySelector("td[data-accent]") !== null;
    const cells = Array.from(tr.querySelectorAll("td")).map((td) => td.textContent?.trim() ?? "");
    return { cells, accentLast };
  });
  return { type: "table", headers, rows };
}

function parseScreens(el: Element): ScreensBlock {
  const items: ScreenItem[] = Array.from(el.querySelectorAll(":scope > article")).map((art, i) => ({
    num: art.getAttribute("data-num") ?? String(i + 1),
    title: art.querySelector("h4")?.textContent?.trim() ?? "",
    body: art.querySelector("p")?.textContent?.trim() ?? "",
    wide: art.hasAttribute("data-wide"),
  }));
  return { type: "screens", items };
}

function parseComponent(el: Element): Block | null {
  const type = el.getAttribute("data-component");
  switch (type) {
    case "grid":       return parseGrid(el);
    case "stats":      return parseStats(el);
    case "timeline":   return parseTimeline(el);
    case "decisions":  return parseDecisions(el);
    case "process":    return parseProcess(el);
    case "comparison": return parseComparison(el);
    case "screens":    return parseScreens(el);
    case "table":      return parseTable(el);
    default:           return null;
  }
}

function parseChildBlocks(parent: Element): Block[] {
  const blocks: Block[] = [];

  for (const child of Array.from(parent.children)) {
    const tag = child.tagName.toLowerCase();

    // Complex component block
    if (child.hasAttribute("data-component")) {
      const block = parseComponent(child);
      if (block) blocks.push(block);
      continue;
    }

    // Tags list
    if (tag === "ul" && child.hasAttribute("data-tags")) {
      blocks.push({ type: "tags", items: extractTags(child) });
      continue;
    }

    // Blockquote → callout
    if (tag === "blockquote") {
      blocks.push({ type: "callout", text: child.textContent?.trim() ?? "" });
      continue;
    }

    // Headings
    if (tag === "h2") {
      blocks.push({ type: "heading", level: 2, text: child.textContent?.trim() ?? "" });
      continue;
    }
    if (tag === "h3") {
      blocks.push({ type: "heading", level: 3, text: child.textContent?.trim() ?? "" });
      continue;
    }
    if (tag === "h4") {
      blocks.push({ type: "heading", level: 4, text: child.textContent?.trim() ?? "" });
      continue;
    }

    // Paragraph
    if (tag === "p") {
      const html = child.innerHTML.trim();
      if (html) blocks.push({ type: "paragraph", html });
      continue;
    }

    // div wrappers (e.g. <div class="prose-group">) — recurse
    if (tag === "div") {
      blocks.push(...parseChildBlocks(child));
    }
  }

  return blocks;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function parseCaseStudy(htmlString: string): ParsedCaseStudy {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");

  // Meta
  const title    = metaContent(doc, "title");
  const eyebrow  = metaContent(doc, "eyebrow");
  const subtitle = metaContent(doc, "subtitle");
  const metadata: MetaField[] = Array.from(
    doc.querySelectorAll('meta[name^="meta:"]')
  ).map((m) => ({
    label: m.getAttribute("name")!.replace("meta:", ""),
    value: m.getAttribute("content") ?? "",
  }));

  // Sections
  const sections: ParsedSection[] = Array.from(doc.querySelectorAll("body > section")).map((sec) => ({
    id: sec.getAttribute("id") ?? "",
    label: sec.getAttribute("data-label") ?? "",
    type: sec.getAttribute("data-type") === "dark" ? "dark" : undefined,
    blocks: parseChildBlocks(sec),
  }));

  return { meta: { title, eyebrow, subtitle, metadata }, sections };
}
