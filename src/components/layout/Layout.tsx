import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import TopNav from "./TopNav";

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopNav />

      {/* Center Content */}
      <main className="flex-1 min-h-screen pt-[48px]">
        <AnimatePresence mode="wait">
          {outlet ? <div key={location.pathname}>{outlet}</div> : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
