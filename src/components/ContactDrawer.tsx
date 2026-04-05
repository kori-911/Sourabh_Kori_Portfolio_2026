import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ExternalLink, X } from "lucide-react";

const CopyableItem = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-end justify-between mb-3 h-8">
        <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="copied"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.15 }}
              className="px-2 py-1 font-mono text-xs font-medium uppercase tracking-wider border bg-primary text-primary-foreground border-primary shadow-sm"
            >
              Copied
            </motion.div>
          ) : isHovered ? (
            <motion.div
              key="copy"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.15 }}
              className="px-2 py-1 font-mono text-xs font-medium uppercase tracking-wider border bg-background text-foreground border-border shadow-sm"
            >
              Click to copy
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group flex items-center justify-between w-full border p-5 transition-all duration-200 focus:outline-none text-left bg-background cursor-pointer ${
          copied
            ? "border-primary ring-1 ring-primary"
            : "border-border hover:border-foreground focus:border-foreground"
        }`}
        aria-label={`Copy ${label}`}
      >
        <span className="font-mono text-sm text-foreground truncate mr-4">{value}</span>
        <div className="flex items-center justify-center shrink-0 w-5 h-5">
          {copied ? (
            <Check className="w-4 h-4 text-primary" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
      </button>
    </div>
  );
};

export default function ContactDrawer({ 
  buttonClassName, 
  buttonText = "Get in Touch →",
  onOpen
}: { 
  buttonClassName?: string;
  buttonText?: string;
  onOpen?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && onOpen) {
      onOpen();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current && 
        !drawerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={buttonClassName || "border border-primary bg-primary text-primary-foreground px-8 py-4 font-mono text-xs font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors inline-block cursor-pointer"}
        aria-expanded={isOpen}
        aria-controls="contact-drawer"
      >
        {buttonText}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            id="contact-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-label="Contact Information"
          >
            <div className="p-8 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-2xl text-foreground">CONTACT</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary p-2 cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <CopyableItem label="Email" value="sourabh.kori@live.com" />
              <CopyableItem label="Phone" value="+91 9328828275" />

              <div className="mb-8">
                <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-3">
                  Social
                </span>
                <a
                  href="https://www.linkedin.com/in/kori911/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between w-full border border-border p-5 hover:border-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary bg-background cursor-pointer"
                  aria-label="Open LinkedIn profile in new tab"
                >
                  <span className="font-mono text-sm text-foreground">LinkedIn</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
