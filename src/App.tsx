import { createHashRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Work from "./pages/Work.tsx";
import CaseStudy from "./pages/CaseStudy.tsx";
import TriageRoom from "./pages/TriageRoom.tsx";
import FilterSystem from "./pages/FilterSystem.tsx";
import Resume from "./pages/Resume.tsx";
import NotFound from "./pages/NotFound.tsx";
import Layout from "./components/layout/Layout.tsx";

/*
 * ─── ROUTING ────────────────────────────────────────────────────────────────
 *
 * createHashRouter is used for static-hosting compatibility (GitHub Pages,
 * Netlify, S3, any CDN). URLs look like: /#/work/triage-room
 *
 * This is the correct React Router v7 API — the legacy <HashRouter> + <Routes>
 * pattern has a known issue where useLocation() doesn't update on navigation.
 *
 * ─── ADDING A NEW CASE STUDY ────────────────────────────────────────────────
 *
 * 1. Create public/case-studies/<slug>.html
 * 2. Create src/pages/<Name>.tsx:
 *      import CaseStudyRenderer from "@/components/case-study/CaseStudyRenderer";
 *      export default function Name() { return <CaseStudyRenderer slug="<slug>" />; }
 * 3. Add a route below BEFORE the :slug catch-all
 * 4. Add the project entry in src/data/projects.ts
 */
const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Index /> },
      { path: "resume", element: <Resume /> },
      { path: "about", element: <About /> },
      { path: "work", element: <Work /> },
      /* ── Case study routes (add new ones here, above the :slug catch-all) ── */
      { path: "work/triage-room", element: <TriageRoom /> },
      { path: "work/filter-system", element: <FilterSystem /> },
      { path: "work/:slug", element: <CaseStudy /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
