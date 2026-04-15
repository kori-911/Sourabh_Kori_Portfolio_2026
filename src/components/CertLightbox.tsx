import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CertLightboxProps {
  cert: string | null;
  onClose: () => void;
}

export default function CertLightbox({ cert, onClose }: CertLightboxProps) {
  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-3xl mx-8 border border-border bg-background shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Certificate</span>
              <button
                onClick={onClose}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <div className="w-full max-h-[75vh] overflow-y-auto">
              <img
                src={cert}
                alt="Certificate"
                className="w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
