import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ContactDrawer from "@/components/ContactDrawer";

const links = [
  { to: "/", label: "HOME" },
  { to: "/work", label: "WORK" },
  { to: "/about", label: "ABOUT" },
  { to: "/resume", label: "RESUME" },
];

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[48px] transition-colors duration-200 ${
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-full w-full">
          <Link
            to="/"
            className="font-mono text-[13px] tracking-widest text-foreground hover:text-primary transition-colors"
          >
            P. SOURABH KORI
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActivePage = location.pathname === link.to || (link.to === "/work" && location.pathname.startsWith("/work/"));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    isActivePage
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <ContactDrawer
              buttonText="CONTACT"
              buttonClassName="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            />
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} strokeWidth={1} /> : <Menu size={18} strokeWidth={1} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background pt-[48px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col items-start px-6 pt-12 gap-8">
              {links.map((link) => {
                const isActivePage = location.pathname === link.to || (link.to === "/work" && location.pathname.startsWith("/work/"));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`font-mono text-2xl tracking-widest transition-colors ${
                      isActivePage
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <ContactDrawer
                buttonText="CONTACT"
                onOpen={() => setMobileOpen(false)}
                buttonClassName="font-mono text-2xl tracking-widest text-foreground hover:text-primary transition-colors cursor-pointer text-left"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
