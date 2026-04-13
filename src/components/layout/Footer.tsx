import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import ContactDrawer from "@/components/ContactDrawer";

const navLinks = [
  { to: "/work", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
];

const socialLinks = [
  { href: "https://linkedin.com/in/sourabhkori", label: "LinkedIn" },
  { href: "https://www.behance.net/sourabhkori", label: "Behance" },
  { href: "mailto:hello@kori911.in", label: "Email" },
  { href: "https://github.com/kori-911", label: "GitHub" },
];

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-5xl mx-auto px-8">

        {/* CTA */}
        <motion.div
          ref={ref}
          className="py-24 md:py-32"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-8">
            — What's next
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] text-foreground leading-[0.95] tracking-tight mb-10 uppercase">
            Have a problem<br />
            <span className="text-primary">worth solving?</span>
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-10 max-w-sm">
            The messy ones are the interesting ones. I'm listening.
          </p>
          <ContactDrawer
            buttonText="GET IN TOUCH →"
            buttonClassName="inline-flex items-center border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary cursor-pointer"
          />
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-border py-12 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">

          {/* Nav */}
          <div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-6">
              Navigate
            </span>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-6">
              Elsewhere
            </span>
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 relative group inline-block"
                  >
                    {link.label}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Credit */}
          <div className="col-span-2 md:col-span-1 md:text-right border-t border-border pt-10 md:border-0 md:pt-0">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] block mb-6">
              Credit
            </span>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Designed &amp; built by<br />
              <span className="text-foreground">Sourabh Kori</span>
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-5 opacity-50">
              © {new Date().getFullYear()} — All rights reserved
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
