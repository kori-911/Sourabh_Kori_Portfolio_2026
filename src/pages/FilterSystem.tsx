import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import ReadingProgress from "@/components/ReadingProgress";
import NextSteps from "@/components/NextSteps";
import { getAdjacentProjects } from "@/data/projects";
import ContactDrawer from "@/components/ContactDrawer";

const adjacent = getAdjacentProjects("filter-system");

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

// ─── Primitives ────────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-4">
      {children}
    </p>
  );
}

function SectionTitle({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-display text-3xl md:text-4xl leading-tight mb-5 ${light ? "text-foreground" : "text-foreground"}`}>
      {children}
    </h2>
  );
}

function Rule() {
  return <div className="h-px w-full bg-border mb-10" />;
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-sm text-muted-foreground leading-[1.85] mb-5 max-w-3xl ${className ?? ""}`}>
      {children}
    </p>
  );
}

function Callout({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`border-l border-primary pl-5 py-1 my-8 max-w-2xl ${dark ? "border-primary/60" : ""}`}>
      <p className="font-mono text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-12 py-10 border-t border-b border-border">
      <span className="font-display text-[80px] text-primary leading-none block -mb-6 opacity-50 select-none">
        "
      </span>
      <p className="font-display text-2xl md:text-3xl text-foreground leading-snug max-w-3xl">
        {children}
      </p>
    </div>
  );
}

function StatRow({ items }: { items: { num: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border my-10">
      {items.map(({ num, label }) => (
        <div key={num} className="bg-background px-6 py-8">
          <span className="font-display text-3xl md:text-4xl text-primary block leading-none mb-3">{num}</span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest leading-snug">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] text-muted-foreground border border-border px-3 py-1 uppercase tracking-widest">
      {children}
    </span>
  );
}

function Section({
  num, eyebrow, title, children, surface,
}: {
  num: string; eyebrow: string; title: string;
  children: React.ReactNode; surface?: boolean;
}) {
  return (
    <motion.section
      className={`relative mb-0 py-20 border-t border-border ${surface ? "bg-muted/5" : ""}`}
      {...fadeUp}
    >
      <span
        className="absolute -top-8 right-0 font-display leading-none text-foreground select-none pointer-events-none"
        style={{ fontSize: "clamp(80px, 12vw, 160px)", opacity: 0.04 }}
        aria-hidden
      >
        {num}
      </span>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle>{title}</SectionTitle>
      <Rule />
      {children}
    </motion.section>
  );
}

// ─── Interactive Demo ──────────────────────────────────────────────────────────

// Checkbox visual: none | checked | indeterminate
function Checkbox({ state, onClick, label }: {
  state: "none" | "checked" | "indeterminate";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      className="w-12 h-12 flex items-center justify-center flex-shrink-0 border-r border-border hover:bg-primary/10 transition-colors"
      onClick={onClick}
      aria-label={label}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
        state !== "none" ? "bg-primary border-primary" : "border-border"
      }`}>
        {state === "checked" && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {state === "indeterminate" && (
          <div className="w-2 h-0.5 bg-black rounded-full" />
        )}
      </div>
    </button>
  );
}

function InteractiveDemo() {
  // children: Map of child id → checked
  const [catOpen, setCatOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [catChildren, setCatChildren] = useState({ mobile: false, pc: false, tv: false });
  const [brandChildren, setBrandChildren] = useState({ galaxy: false, neo: false });
  const [feedback, setFeedback] = useState("Click a label or checkbox to see the difference →");
  const [fbActive, setFbActive] = useState(false);

  function showMsg(msg: string) {
    setFeedback(msg);
    setFbActive(true);
    setTimeout(() => setFbActive(false), 2400);
  }

  // Derive parent state from children
  function parentState(children: Record<string, boolean>): "none" | "checked" | "indeterminate" {
    const vals = Object.values(children);
    const numChecked = vals.filter(Boolean).length;
    if (numChecked === 0) return "none";
    if (numChecked === vals.length) return "checked";
    return "indeterminate";
  }

  function handleParentCheck(row: "cat" | "brand") {
    if (row === "cat") {
      const current = parentState(catChildren);
      const next = current === "checked" ? false : true;
      setCatChildren({ mobile: next, pc: next, tv: next });
      showMsg(next ? "✓ Parent checkbox: all children selected (expand unchanged)" : "✗ Parent checkbox: all children deselected");
    } else {
      const current = parentState(brandChildren);
      const next = current === "checked" ? false : true;
      setBrandChildren({ galaxy: next, neo: next });
      showMsg(next ? "✓ Parent checkbox: all children selected (expand unchanged)" : "✗ Parent checkbox: all children deselected");
    }
  }

  function handleParentExpand(row: "cat" | "brand") {
    if (row === "cat") {
      if (parentState(catChildren) === "checked") { showMsg("Label click ignored when row is fully selected"); return; }
      setCatOpen(o => !o);
      showMsg(!catOpen ? "→ Label: expanded only — selection unchanged" : "← Label: collapsed only — selection unchanged");
    } else {
      if (parentState(brandChildren) === "checked") { showMsg("Label click ignored when row is fully selected"); return; }
      setBrandOpen(o => !o);
      showMsg(!brandOpen ? "→ Label: expanded only — selection unchanged" : "← Label: collapsed only — selection unchanged");
    }
  }

  function handleChildCheck(row: "cat" | "brand", id: string) {
    if (row === "cat") {
      const next = { ...catChildren, [id]: !catChildren[id as keyof typeof catChildren] };
      setCatChildren(next);
      const ps = parentState(next);
      showMsg(
        ps === "indeterminate"
          ? `◐ Child checked — parent shows intermediate state`
          : ps === "checked"
          ? "✓ All children checked — parent is fully selected"
          : "✗ All children unchecked — parent deselected"
      );
    } else {
      const next = { ...brandChildren, [id]: !brandChildren[id as keyof typeof brandChildren] };
      setBrandChildren(next);
      const ps = parentState(next);
      showMsg(
        ps === "indeterminate"
          ? `◐ Child checked — parent shows intermediate state`
          : ps === "checked"
          ? "✓ All children checked — parent is fully selected"
          : "✗ All children unchecked — parent deselected"
      );
    }
  }

  const isExpanded = (row: "cat" | "brand") =>
    row === "cat" ? catOpen : brandOpen;

  return (
    <div className="max-w-lg my-8">
      {/* Rule bar */}
      <div className="px-5 py-3 bg-foreground/90 text-background rounded-t-lg font-mono text-[11px] flex items-center gap-2">
        <span className="opacity-40 text-[9px] uppercase tracking-widest">Rule</span>
        Label = navigate only &nbsp;·&nbsp; Checkbox = select + expand
      </div>

      {/* Tree */}
      <div className="border border-border border-t-0 bg-background">

        {/* ── Category row ── */}
        <div className={`flex items-center border-b border-border ${isExpanded("cat") ? "bg-muted/10" : ""}`}>
          <Checkbox state={parentState(catChildren)} onClick={() => handleParentCheck("cat")} label="Select Product Category" />
          <button
            className="flex-1 px-4 py-3 text-left font-mono text-xs font-medium text-foreground hover:text-primary transition-colors flex items-center justify-between"
            onClick={() => handleParentExpand("cat")}
          >
            Product Category
            <span className={`text-muted-foreground text-[10px] transition-transform duration-200 ${isExpanded("cat") ? "rotate-90" : ""}`}>▶</span>
          </button>
        </div>
        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isExpanded("cat") ? "300px" : "0" }}>
          {(["mobile", "pc", "tv"] as const).map((id, i, arr) => (
            <div key={id} className={`flex items-center pl-6 ${i < arr.length - 1 ? "border-b border-border" : ""} bg-muted/5`}>
              <Checkbox
                state={catChildren[id] ? "checked" : "none"}
                onClick={() => handleChildCheck("cat", id)}
                label={id}
              />
              <span className="font-mono text-[11px] text-muted-foreground px-4 py-3">
                {id === "mobile" ? "Mobile" : id === "pc" ? "PC" : "TV & Appliances"}
              </span>
            </div>
          ))}
        </div>

        {/* ── Brand row ── */}
        <div className={`flex items-center border-b border-border ${isExpanded("brand") ? "bg-muted/10" : ""}`}>
          <Checkbox state={parentState(brandChildren)} onClick={() => handleParentCheck("brand")} label="Select Brand" />
          <button
            className="flex-1 px-4 py-3 text-left font-mono text-xs font-medium text-foreground hover:text-primary transition-colors flex items-center justify-between"
            onClick={() => handleParentExpand("brand")}
          >
            Brand
            <span className={`text-muted-foreground text-[10px] transition-transform duration-200 ${isExpanded("brand") ? "rotate-90" : ""}`}>▶</span>
          </button>
        </div>
        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isExpanded("brand") ? "200px" : "0" }}>
          {(["galaxy", "neo"] as const).map((id, i, arr) => (
            <div key={id} className={`flex items-center pl-6 ${i < arr.length - 1 ? "border-b border-border" : ""} bg-muted/5`}>
              <Checkbox
                state={brandChildren[id] ? "checked" : "none"}
                onClick={() => handleChildCheck("brand", id)}
                label={id}
              />
              <span className="font-mono text-[11px] text-muted-foreground px-4 py-3">
                {id === "galaxy" ? "Galaxy" : "Neo QLED"}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Feedback */}
      <div className={`px-5 py-3 border border-border border-t-0 rounded-b-lg font-mono text-[11px] transition-all duration-200 ${
        fbActive ? "text-primary bg-primary/5" : "text-muted-foreground bg-muted/5"
      }`}>
        {feedback}
      </div>
    </div>
  );
}

// ─── Capability Matrix ─────────────────────────────────────────────────────────

function Matrix() {
  const rows = [
    ["Simple hierarchy", "Single column", "Hierarchical + grid toggle"],
    ["Alternate hierarchy (cascade)", "Sub-tab switcher", "Cascades on switch"],
    ["Alternate hierarchy (independent)", "Radio switcher", "OR condition preserved"],
    ["Cross-dim interdependency", "Orange indicator", "Syncs bidirectionally"],
    ["Double-width layout", "2-col + carousel", "N/A"],
    ["Filter Criteria active", "Read-only indicator", "Expression builder"],
    ["Search active", "Within dimension tab", "Clears on grid switch"],
    ["Member Specific Attrs", "Dynamic in Other Filters", "Via FC pane"],
  ];

  return (
    <div className="my-8 overflow-x-auto">
      {/* Header */}
      <div className="grid grid-cols-[220px_1fr_1fr] gap-px bg-border min-w-[580px]">
        {["Configuration", "Right Pane", "Expanded Mode"].map((h, i) => (
          <div
            key={h}
            className={`bg-foreground/90 text-background font-mono text-[10px] uppercase tracking-widest px-4 py-3 ${
              i === 0 ? "rounded-tl-lg" : i === 2 ? "rounded-tr-lg" : ""
            }`}
          >
            {h}
          </div>
        ))}
      </div>
      {/* Rows */}
      <div className="grid gap-px bg-border min-w-[580px]">
        {rows.map(([config, right, expanded], i) => (
          <div
            key={config}
            className="grid grid-cols-[220px_1fr_1fr] gap-px group"
          >
            <div className={`bg-background px-4 py-3 font-mono text-[11px] font-medium text-foreground group-hover:bg-muted/10 transition-colors ${i === rows.length - 1 ? "rounded-bl-lg" : ""}`}>
              {config}
            </div>
            <div className="bg-background px-4 py-3 font-mono text-[11px] text-muted-foreground group-hover:bg-muted/10 transition-colors">
              <span className="text-primary mr-1">✓</span> {right}
            </div>
            <div className={`bg-background px-4 py-3 font-mono text-[11px] text-muted-foreground group-hover:bg-muted/10 transition-colors ${i === rows.length - 1 ? "rounded-br-lg" : ""}`}>
              {expanded !== "N/A" ? <><span className="text-primary mr-1">✓</span> {expanded}</> : <span className="text-muted-foreground/40">N/A</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FilterSystem() {
  return (
    <PageWrapper className="bg-background">
      <ReadingProgress />

      <div className="max-w-5xl mx-auto px-8 pt-28 pb-28">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.div
          className="pb-20 mb-4 border-b border-border"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Link
            to="/work"
            className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] hover:text-primary transition-colors inline-block mb-14"
          >
            ← Work
          </Link>

          {/* Ghost watermark */}
          <div className="relative">
            <span
              className="absolute -top-4 left-0 font-display leading-none text-foreground select-none pointer-events-none"
              style={{ fontSize: "clamp(120px, 20vw, 280px)", opacity: 0.03 }}
              aria-hidden
            >
              Filter
            </span>

            <div className="relative">
              <p className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-5">
                Case Study — o9 Solutions
              </p>

              <h1 className="font-display text-5xl md:text-7xl text-foreground leading-[0.95] tracking-tight mb-8">
                Designing the<br />
                <em className="not-italic text-primary">Always On Pane</em><br />
                & the filter system beneath it
              </h1>

              <p className="font-mono text-sm text-muted-foreground leading-[1.85] max-w-2xl mb-10">
                From legacy to unified: redesigning o9's filtering system across three surfaces, five phases, one consistent data model.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-border">
                {[
                  { label: "Role", value: "Sole Product Designer" },
                  { label: "Surfaces", value: "Right Pane · Expanded Mode · Vertical Filter" },
                  { label: "Platform", value: "o9 Digital Brain (Enterprise SaaS)" },
                  { label: "Client origin", value: "Global enterprise — electronics & supply chain" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
                    <p className="font-mono text-xs text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section 01 — Domain Problem ───────────────────────────────── */}
        <Section num="01" eyebrow="01 — The domain problem" title="Before you design a filter, you have to understand what it's actually filtering">
          <Body>
            o9's platform runs on a data model of dimensions, attributes, measures, and properties
            — and the relationships between them are not simple. A dimension like Product contains
            hierarchy attributes spanning six levels. Time can be structured as Year → Quarter →
            Week or Year → Season → Week — same dimension, different structural paths. Measures sit
            at intersections. Properties describe attributes themselves.
          </Body>
          <Body>
            A filter is not a UI element that sits on top of data. It is an interface into the
            data model itself. Design it without understanding the model, and you will get the
            interactions wrong — not visibly, but at the edges. In the cases that matter most.
          </Body>

          <div className="flex flex-wrap gap-2 mb-8">
            <Tag>Data Model Fluency</Tag>
            <Tag>Platform Architecture</Tag>
            <Tag>Systems Thinking</Tag>
          </div>

          <Callout>
            <strong className="text-foreground">My starting point:</strong> Not Figma. I spent
            my first weeks developing a working understanding of dimensions, hierarchy depth,
            attribute aliasing, interdependency rules, and the query layer underneath — well enough
            to anticipate where filters break, and then design so they don't.
          </Callout>

          <div className="grid grid-cols-3 gap-px bg-border border border-border my-10">
            {[
              { num: "3", label: "Filter surfaces designed end-to-end" },
              { num: "5", label: "Phases of capability accumulation" },
              { num: "8×2", label: "Configuration matrix — every feature verified across both surfaces" },
            ].map(({ num, label }) => (
              <div key={num} className="bg-background px-6 py-8">
                <span className="font-display text-4xl text-primary block leading-none mb-3">{num}</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 02 — The Complexity ───────────────────────────────── */}
        <Section num="02" eyebrow="02 — The complexity" title="Three axes that make enterprise filtering genuinely hard" surface>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              {
                num: "I",
                title: "Vertical hierarchy",
                desc: "Attributes span L1 through L6. Selection at any level cascades up and down. Deselect a parent — all children deselect. The bottom grid always shows leaf-level reality. Count messages, partial-selection indicators, and select-all each need separate behaviour logic.",
              },
              {
                num: "II",
                title: "Alternate hierarchies",
                desc: "Same dimension, multiple structural paths. These can be cascading (AND) or independent (OR). Tab strip vs radio buttons isn't aesthetic — it's a statement about how the data behaves. The visual affordance communicates the relationship.",
              },
              {
                num: "III",
                title: "Cross-dimension interdependency",
                desc: "Selecting a Product category can change which Locations are valid. The system re-queries silently. Options update. The user needs to understand why their choices changed — through design, not tooltips.",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="border border-border bg-background p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                <span className="font-display text-3xl text-primary block mb-3 leading-none">{num}</span>
                <p className="font-mono text-xs font-medium text-foreground mb-2">{title}</p>
                <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* 70/30 bar */}
          <div className="max-w-2xl mb-6">
            <div className="flex h-12 rounded-lg overflow-hidden">
              <div className="flex-[7] flex items-center justify-center font-mono text-sm font-medium text-muted-foreground bg-muted/20 border border-border border-r-0 rounded-l-lg">
                70%
              </div>
              <div className="flex-[3] flex items-center justify-center font-mono text-sm font-medium text-background bg-primary rounded-r-lg">
                30%
              </div>
            </div>
            <div className="flex justify-between mt-3 gap-4">
              <p className="font-mono text-[11px] text-muted-foreground max-w-xs">
                <span className="text-foreground font-medium">Most users</span> pick a few members and move on. They never encounter any of this.
              </p>
              <p className="font-mono text-[11px] text-primary text-right max-w-xs">
                Power users running complex global operations. The platform's most critical users.
              </p>
            </div>
          </div>

          <PullQuote>
            The challenge wasn't a lack of effort—it was the growing complexity of requirements. The key was understanding how filtering could be designed within the constraints of the existing data model.
          </PullQuote>
        </Section>

        {/* ── Section 03 — Two Surfaces ─────────────────────────────────── */}
        <Section num="03" eyebrow="03 — Two surfaces, one mental model" title="The right pane and the expanded mode are the same filter at different zoom levels">
          <Body>
            Same data. Same selection state. Same filter configuration. But presented in completely
            different spatial arrangements — one narrow and vertical, the other wide and horizontal.
            A planner switching between them needs to feel their mental model of "where my selection
            is" transfers without confusion.
          </Body>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            {[
              {
                name: "Right Pane",
                badge: "Always on",
                attrs: [
                  "~270px wide, persistent alongside content",
                  "Dimension tabs across top",
                  "Hierarchy stacked vertically",
                  "Other Filters unified at bottom",
                  "Double-width toggle for deep hierarchies",
                ],
              },
              {
                name: "Expanded Mode",
                badge: "On demand",
                attrs: [
                  "Full-page, triggered by filter chip click",
                  "Attribute levels side by side as columns",
                  "Bottom grid: leaf selections + parent chain",
                  "Properties tab for cross-dimension filters",
                  "Filter Criteria expression builder",
                ],
              },
            ].map(({ name, badge, attrs }) => (
              <div key={name} className="border border-border bg-background">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <span className="font-mono text-xs font-medium text-foreground">{name}</span>
                  <span className="font-mono text-[10px] text-primary border border-primary/40 px-3 py-1 rounded-full">
                    {badge}
                  </span>
                </div>
                <div className="p-5 space-y-2.5">
                  {attrs.map((a) => (
                    <div key={a} className="flex gap-2.5 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 flex-shrink-0" />
                      <span className="font-mono text-[11px] text-muted-foreground leading-relaxed">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 04 — The Interaction ──────────────────────────────── */}
        <Section num="04" eyebrow="04 — The interaction" title="One row, two controls, completely different intents" surface>
          <Body>
            Every hierarchy row has a label and a checkbox. They sit adjacent. They do completely
            different things. Getting this wrong in supply chain planning is a data integrity
            problem — planners accidentally include data they didn't intend, or miss selections
            that affect downstream calculations.
          </Body>

          <InteractiveDemo />
        </Section>

        {/* ── Section 05 — The Invisible Work ───────────────────────────── */}
        <Section num="05" eyebrow="05 — The invisible work" title="Every new capability had to work in every existing configuration">
          <Body>
            This is where filter design at scale gets genuinely hard — not in any single
            interaction, but in the combinatorial surface of interactions that have to coexist
            without contradiction. Each new capability was verified across the full existing matrix.
          </Body>

          <Matrix />

          <PullQuote>
            When this is done right, the user never sees the matrix. The invisibility of correct systems design is both the goal and the reason it is easy to underestimate.
          </PullQuote>
        </Section>

        {/* ── Section 06 — Outcome ──────────────────────────────────────── */}
        <Section num="06" eyebrow="06 — In the end" title="Three surfaces. Five phases. One data model.">
          <Body>
            The AOP is now a core part of o9's platform — not a client-specific implementation,
            but something every planner who uses o9 encounters. Most of them will never know what
            went into what they see. They will select their members, hit apply, and move on.
          </Body>

          <StatRow items={[
            { num: "3", label: "Filter surfaces designed and shipped" },
            { num: "Platform", label: "Core feature — ships across all o9 tenants" },
            { num: "5", label: "Phases of capability accumulation without regression" },
            { num: "Sole", label: "Designer — the entire filter system" },
          ]} />

          <Callout>
            <strong className="text-foreground">The hardest design work is the kind that removes itself from the picture entirely.</strong>{" "}
            Enterprise filter design is where data architecture and interaction design become the
            same problem. You cannot solve one without fluency in the other.
          </Callout>

          {/* Deliverables */}
          <div className="mt-10 mb-8">
            <p className="font-mono text-xs font-medium text-foreground mb-6">What I delivered beyond screens</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Design artifacts",
                  items: [
                    "Figma prototypes for all 3 filter surfaces",
                    "7 user flows (vertical filter pane)",
                    "6 layout explorations (properties tab)",
                    "Interaction model documentation",
                    "UX specs for all state transitions",
                  ],
                },
                {
                  title: "Cross-functional contributions",
                  items: [
                    "Designer-side configurator changes",
                    "Dynamic attribute alias — model + report config",
                    "Double-width behaviour specs (confirmed with client)",
                    "Filter Criteria enhancement documentation",
                    "Error handling & edge case specs",
                  ],
                },
              ].map(({ title, items }) => (
                <div key={title} className="border border-border p-6">
                  <p className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4">{title}</p>
                  {items.map((item) => (
                    <p key={item} className="font-mono text-[11px] text-muted-foreground py-2 border-b border-border/40 last:border-0">
                      {item}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Systems Thinking", "Data Model Fluency", "Multi-surface Design", "Interaction Precision", "Platform Scalability"].map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </Section>

        {/* ── Connect CTA ───────────────────────────────────────────────── */}
        <motion.div className="border-t border-border pt-20 mb-20" {...fadeUp}>
          <p className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-6">
            Full case study
          </p>
          <p className="font-display text-3xl md:text-4xl text-foreground leading-tight mb-3 max-w-xl">
            Curious to see how it all came together?
          </p>
          <p className="font-display text-3xl md:text-4xl text-primary leading-tight mb-10 max-w-xl">
            Let's connect.
          </p>
          <ContactDrawer
            buttonText="Get in touch →"
            buttonClassName="font-mono text-xs text-primary border border-primary px-8 py-4 uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer inline-block"
          />
        </motion.div>

        {/* ── Next / Prev ───────────────────────────────────────────────── */}
        <NextSteps prev={adjacent.prev} next={adjacent.next} />
      </div>
    </PageWrapper>
  );
}
