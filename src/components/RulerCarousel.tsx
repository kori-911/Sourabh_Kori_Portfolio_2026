import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Project } from "@/data/projects";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ComingSoonItem {
  id: string;
  type: "coming-soon";
}

export type CarouselItem = Project | ComingSoonItem;

function isComingSoon(item: CarouselItem): item is ComingSoonItem {
  return (item as ComingSoonItem).type === "coming-soon";
}

// ─── Ruler strip ─────────────────────────────────────────────────────────────

const TICK_INTERVAL = 48;
const MAJOR_EVERY   = 4;
const TICK_SM       = 6;
const TICK_LG       = 16;

function RulerStrip({ width, offsetX }: { width: number; offsetX: number }) {
  const count      = Math.ceil(width / TICK_INTERVAL) + 4;
  const startIndex = Math.floor(-offsetX / TICK_INTERVAL);

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={width}
      height={TICK_LG + 4}
      style={{ overflow: "visible" }}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const idx   = startIndex + i;
        const x     = idx * TICK_INTERVAL + offsetX;
        const major = idx % MAJOR_EVERY === 0;
        return (
          <g key={idx}>
            <line
              x1={x} y1={0} x2={x} y2={major ? TICK_LG : TICK_SM}
              stroke="currentColor"
              strokeWidth={major ? 1 : 0.5}
              opacity={major ? 0.28 : 0.1}
            />
            {major && (
              <text
                x={x + 4} y={TICK_LG - 2}
                fill="currentColor"
                opacity={0.22}
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "8px",
                  letterSpacing: "0.05em",
                }}
              >
                {String(Math.abs(idx)).padStart(2, "0")}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Card: real project ───────────────────────────────────────────────────────

function ProjectCard({
  project,
  localIndex,
  isActive,
  onNavigate,
}: {
  project: Project;
  localIndex: number;
  isActive: boolean;
  onNavigate: () => void;
}) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-72 cursor-pointer select-none"
      animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={onNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onNavigate()}
      aria-label={`View case study: ${project.title}`}
    >
      <div className="aspect-[4/3] border border-border overflow-hidden mb-4 relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, hsl(var(--background)) 0%, transparent 60%)",
            opacity: isActive ? 0.45 : 0.72,
          }}
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] text-muted-foreground">
          {String(localIndex + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-1 px-0.5">
        <h3 className="font-display text-lg text-foreground leading-tight">
          {project.title}
        </h3>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          {project.client}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/60 leading-snug line-clamp-2">
          {project.summary}
        </p>
      </div>

      <motion.div
        className="h-px bg-primary mt-4"
        animate={{ scaleX: isActive ? 1 : 0 }}
        style={{ originX: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}

// ─── Card: coming soon ────────────────────────────────────────────────────────

function ComingSoonCard({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      className="relative flex-shrink-0 w-72 select-none cursor-default"
      animate={{ opacity: isActive ? 0.5 : 0.2, scale: isActive ? 1 : 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="aspect-[4/3] border border-dashed border-border/40 mb-4 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
        {/* shimmer lines */}
        <div className="absolute inset-0 flex flex-col justify-center gap-5 px-8 opacity-[0.05]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-px bg-foreground w-full" />
          ))}
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
          Case study in progress
        </span>
      </div>

      <div className="space-y-2 px-0.5">
        <div className="h-3 bg-foreground/8 w-2/5" />
        <div className="h-2 bg-foreground/8 w-4/5" />
        <div className="h-2 bg-foreground/8 w-3/5" />
      </div>

      <div className="h-px bg-border/20 mt-4" />
    </motion.div>
  );
}

// ─── Main carousel ────────────────────────────────────────────────────────────

const CARD_W  = 288; // w-72
const CARD_GAP = 32; // gap-8
const STEP    = CARD_W + CARD_GAP;

// Guarantee at least MIN_SHOWN items (pad with coming-soon)
const MIN_SHOWN = 3;

interface RulerCarouselProps {
  items: CarouselItem[];
}

export default function RulerCarousel({ items }: RulerCarouselProps) {
  const navigate = useNavigate();

  // Pad with coming-soon slots if not enough real items
  const padded: CarouselItem[] = [...items];
  while (padded.length < MIN_SHOWN) {
    padded.push({ id: `cs-${padded.length}`, type: "coming-soon" });
  }

  // Triplicate for infinite scroll
  const infinite = [...padded, ...padded, ...padded];
  const setSize  = padded.length;

  const trackRef    = useRef<HTMLDivElement>(null);
  const [viewW, setViewW]         = useState(900);
  const [activeIdx, setActiveIdx] = useState(0);
  const [dragging, setDragging]   = useState(false);

  const initialX = -(setSize * STEP);
  const x        = useMotionValue(initialX);
  const springX  = useSpring(x, { stiffness: 220, damping: 32, mass: 0.8 });

  // Measure container width
  useEffect(() => {
    const el = trackRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setViewW(e.contentRect.width));
    ro.observe(el);
    setViewW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  // Track active index from spring position
  useEffect(() => {
    return springX.on("change", (v) => {
      const raw      = -v / STEP;
      const clamped  = ((Math.round(raw) % setSize) + setSize) % setSize;
      setActiveIdx(clamped);
    });
  }, [springX, setSize]);

  const wrapX = useCallback(() => {
    const cur = x.get();
    const lo  = -(setSize * 2 * STEP);
    const hi  = 0;
    if (cur < lo) x.set(cur + setSize * STEP);
    if (cur > hi) x.set(cur - setSize * STEP);
  }, [x, setSize]);

  const goTo = useCallback(
    (delta: number) => {
      x.set(x.get() - delta * STEP);
      wrapX();
    },
    [x, wrapX]
  );

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo]);

  // Ruler offset
  const [rulerOff, setRulerOff] = useState(0);
  useEffect(() => {
    return springX.on("change", (v) => {
      setRulerOff(((v % TICK_INTERVAL) + TICK_INTERVAL) % TICK_INTERVAL);
    });
  }, [springX]);

  return (
    <div className="relative w-full overflow-hidden select-none" ref={trackRef}>
      {/* Ruler */}
      <div className="relative h-7 mb-5 border-b border-border/30">
        <RulerStrip width={viewW} offsetX={rulerOff} />
      </div>

      {/* Draggable track */}
      <motion.div
        className="flex gap-8 cursor-grab active:cursor-grabbing"
        style={{ x: springX }}
        drag="x"
        dragElastic={0.06}
        dragMomentum={false}
        onDragStart={() => setDragging(true)}
        onDragEnd={(_, info) => {
          setDragging(false);
          const snapped = Math.round(-x.get() / STEP);
          x.set(-(snapped * STEP));
          wrapX();
          void info;
        }}
      >
        {infinite.map((item, i) => {
          const localIdx = i % setSize;
          const isActive = localIdx === activeIdx;

          if (isComingSoon(item)) {
            return (
              <ComingSoonCard
                key={`${item.id}-${i}`}
                isActive={isActive}
              />
            );
          }

          return (
            <ProjectCard
              key={`${item.id}-${i}`}
              project={item as Project}
              localIndex={localIdx}
              isActive={isActive}
              onNavigate={() => {
                if (!dragging) navigate(`/work/${(item as Project).slug}`);
              }}
            />
          );
        })}
      </motion.div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-20 pointer-events-none bg-gradient-to-r from-background to-transparent" />
      <div className="absolute inset-y-0 right-0 w-20 pointer-events-none bg-gradient-to-l from-background to-transparent" />

      {/* Controls bar */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-border/30">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40">
          Drag · Arrow keys
        </span>

        <div className="flex items-center gap-5">
          {/* Dot indicators — only for real projects */}
          <div className="flex gap-2 items-center">
            {padded.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  const curStep = -Math.round(x.get() / STEP);
                  const curSet  = Math.floor(curStep / setSize);
                  x.set(-((curSet * setSize + i) * STEP));
                  wrapX();
                }}
                aria-label={
                  isComingSoon(item) ? "Coming soon" : `Go to ${(item as Project).title}`
                }
                className={`transition-all duration-300 ${
                  i === activeIdx
                    ? "w-6 h-px bg-primary"
                    : isComingSoon(item)
                    ? "w-2 h-px bg-foreground/15"
                    : "w-2 h-px bg-foreground/25"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="flex gap-2">
            <button
              onClick={() => goTo(-1)}
              className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border hover:border-foreground"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => goTo(1)}
              className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border hover:border-foreground"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
