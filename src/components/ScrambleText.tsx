import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export default function ScrambleText({ text, className }: { text: string; className?: string; }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isInView) return;
    let iteration = 0;
    const totalFrames = text.length * 4;
    const animate = () => {
      setDisplay(text.split("").map((char, i) => {
        if (char === " ") return " ";
        if (i < Math.floor(iteration / 4)) return text[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      iteration++;
      if (iteration <= totalFrames) { frameRef.current = setTimeout(animate, 40); }
      else { setDisplay(text); }
    };
    frameRef.current = setTimeout(animate, 40);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [isInView, text]);

  return <span ref={ref} className={className}>{display}</span>;
}
