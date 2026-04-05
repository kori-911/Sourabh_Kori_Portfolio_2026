import type {
  Block,
  GridCard,
  TableRow,
} from "@/lib/case-study-parser";

// ─── Primitives ───────────────────────────────────────────────────────────────

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="border border-primary/60 text-primary font-mono text-[10px] px-2.5 py-1 uppercase tracking-wider">
    {children}
  </span>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border border-border p-6 md:p-8 ${className}`}>{children}</div>
);

// ─── Grid ─────────────────────────────────────────────────────────────────────

function GridBlock({
  cols,
  cards,
}: {
  cols?: 2 | 3;
  cards: GridCard[];
}) {
  const gridClass =
    cols === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-5"
      : "grid grid-cols-1 md:grid-cols-2 gap-5";

  return (
    <div className={gridClass}>
      {cards.map((card, i) => (
        <Card key={i}>
          {card.badge && (
            <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">
              {card.badge}
            </p>
          )}
          {card.title && !card.badge && (
            <p className="font-display text-sm text-foreground mb-5">{card.title}</p>
          )}
          <ul className="font-mono text-xs text-foreground/60 space-y-2.5">
            {card.list.map((item, j) => (
              <li key={j} className="flex gap-3">
                <span className="text-primary flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsBlock({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 mt-10">
      {items.map(({ value, label }, i) => (
        <div key={i}>
          <p className="font-display text-4xl text-primary mb-2">{value}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground leading-snug">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function TimelineBlock({
  entries,
}: {
  entries: { date: string; title: string; body: string; tags?: string[] }[];
}) {
  return (
    <div className="relative border-l border-border pl-10 space-y-14">
      {entries.map(({ date, title, body, tags }, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[2.625rem] top-1.5 w-2.5 h-2.5 bg-primary rounded-full" />
          <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">{date}</p>
          <p className="font-display text-lg text-foreground mb-3">{title}</p>
          <p className="font-mono text-sm text-foreground/60 leading-relaxed mb-4">{body}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Decisions ────────────────────────────────────────────────────────────────

function DecisionsBlock({
  items,
}: {
  items: { num?: string; q: string; a: string; tags?: string[] }[];
}) {
  return (
    <div className="space-y-5">
      {items.map(({ num, q, a, tags }, i) => (
        <Card key={i} className="space-y-4">
          <div className="flex items-start gap-4">
            <span className="font-mono text-[10px] text-primary border border-primary/40 px-1.5 py-0.5 flex-shrink-0 mt-0.5">
              {num ?? String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-display text-lg text-foreground leading-snug">{q}</p>
          </div>
          <p className="font-mono text-sm text-foreground/60 leading-relaxed">{a}</p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── Process ──────────────────────────────────────────────────────────────────

function ProcessBlock({
  steps,
}: {
  steps: { num: string; title: string; body: string }[];
}) {
  return (
    <div className="flex flex-col md:flex-row mb-14 overflow-x-auto">
      {steps.map(({ num, title, body }, i) => (
        <div key={num} className="flex items-stretch md:flex-1">
          <div className="border border-border p-5 flex-1">
            <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">{num}</p>
            <p className="font-display text-sm text-foreground mb-1.5">{title}</p>
            <p className="font-mono text-[11px] text-muted-foreground leading-snug">{body}</p>
          </div>
          {i < steps.length - 1 && (
            <div className="hidden md:flex items-center px-1 text-muted-foreground text-[10px]">→</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Comparison ───────────────────────────────────────────────────────────────

function ComparisonBlock({
  phases,
}: {
  phases: { label: string; variant?: "default" | "success"; items: string[] }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {phases.map(({ label, variant, items }, i) => (
        <div key={i}>
          <div
            className={`flex items-center justify-between mb-5 border-b pb-4 ${
              variant === "success" ? "border-primary/30" : "border-border"
            }`}
          >
            <p
              className={`font-mono text-[10px] uppercase tracking-wider ${
                variant === "success" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </p>
          </div>
          <div className="aspect-[16/9] bg-muted/10 border border-dashed border-border flex items-center justify-center mb-6">
            <p className="font-mono text-[10px] text-muted-foreground">
              {variant === "success" ? "Final screen placeholder" : "Wireframe placeholder"}
            </p>
          </div>
          <ul className={`font-mono text-xs space-y-3 ${variant === "success" ? "text-foreground/70" : "text-foreground/50"}`}>
            {items.map((item, j) => (
              <li key={j} className="flex gap-3">
                <span className={variant === "success" ? "text-primary" : "text-muted-foreground"}>
                  {variant === "success" ? "✓" : "×"}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function ScreensBlock({
  items,
}: {
  items: { num: string; title: string; body: string; wide?: boolean }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map(({ num, title, body, wide }) => (
        <Card key={num} className={`space-y-5 ${wide ? "md:col-span-2" : ""}`}>
          <div className="flex items-start gap-4">
            <span className="font-mono text-[10px] text-primary border border-primary/40 px-1.5 py-0.5 flex-shrink-0 mt-0.5">
              {num.padStart(2, "0")}
            </span>
            <div>
              <p className="font-display text-lg text-foreground mb-2">{title}</p>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed">{body}</p>
            </div>
          </div>
          <div className="aspect-[16/9] bg-muted/10 border border-dashed border-border flex items-center justify-center">
            <p className="font-mono text-[10px] text-muted-foreground">Screen placeholder</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────

function TableBlock({
  headers,
  rows,
}: {
  headers: string[];
  rows: TableRow[];
}) {
  return (
    <div className="overflow-x-auto my-10">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground pb-3 pr-8 font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border">
              {row.cells.map((cell, j) => (
                <td
                  key={j}
                  className={`py-4 pr-8 font-mono text-xs leading-relaxed align-top ${
                    j === 0
                      ? "text-foreground font-medium"
                      : j === row.cells.length - 1 && row.accentLast
                      ? "text-primary"
                      : "text-foreground/50"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main renderer ────────────────────────────────────────────────────────────

export default function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      if (block.level === 2) {
        return (
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-8 leading-snug">
            {block.text}
          </h2>
        );
      }
      if (block.level === 3) {
        return (
          <h3 className="font-display text-xl text-foreground mb-5 mt-14">{block.text}</h3>
        );
      }
      return <h4 className="font-display text-lg text-foreground mb-4">{block.text}</h4>;

    case "paragraph":
      return (
        <p
          className="font-mono text-sm text-foreground/70 leading-relaxed mb-6"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );

    case "callout":
      return (
        <div className="border-l-2 border-primary pl-6 py-4 bg-primary/5 my-10">
          <p className="font-mono text-sm text-foreground/75 leading-relaxed">{block.text}</p>
        </div>
      );

    case "tags":
      return (
        <div className="flex flex-wrap gap-2 mb-10">
          {block.items.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      );

    case "grid":
      return <GridBlock cols={block.cols} cards={block.cards} />;

    case "stats":
      return <StatsBlock items={block.items} />;

    case "timeline":
      return <TimelineBlock entries={block.entries} />;

    case "decisions":
      return <DecisionsBlock items={block.items} />;

    case "process":
      return <ProcessBlock steps={block.steps} />;

    case "comparison":
      return <ComparisonBlock phases={block.phases} />;

    case "screens":
      return <ScreensBlock items={block.items} />;

    case "table":
      return <TableBlock headers={block.headers} rows={block.rows} />;

    default:
      return null;
  }
}
