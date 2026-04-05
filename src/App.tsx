import { HashRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Work from "./pages/Work.tsx";
import CaseStudy from "./pages/CaseStudy.tsx";
import TriageRoom from "./pages/TriageRoom.tsx";
import FilterSystem from "./pages/FilterSystem.tsx";
import Resume from "./pages/Resume.tsx";
import NotFound from "./pages/NotFound.tsx";
import Layout from "./components/layout/Layout.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";

/*
 * ─── ROUTING ────────────────────────────────────────────────────────────────
 *
 * HashRouter is used intentionally for static-hosting compatibility.
 * It works on GitHub Pages, Netlify, Vercel, S3, and any static file server
 * with ZERO server config needed. URLs look like: /#/work/triage-room
 *
 * ─── ADDING A NEW CASE STUDY ────────────────────────────────────────────────
 *
 * 1. Create public/case-studies/<slug>.html  (content file)
 * 2. Create src/pages/<Name>.tsx:
 *      import CaseStudyRenderer from "@/components/case-study/CaseStudyRenderer";
 *      export default function Name() { return <CaseStudyRenderer slug="<slug>" />; }
 * 3. Add a <Route> below BEFORE the :slug catch-all
 * 4. Add the project entry in src/data/projects.ts
 */
const App = () => (
  <HashRouter>
    <ScrollToTop />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        {/* ── Case study routes (add new ones here, above the :slug catch-all) ── */}
        <Route path="/work/triage-room" element={<TriageRoom />} />
        <Route path="/work/filter-system" element={<FilterSystem />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </HashRouter>
);

export default App;
