// App.tsx — Punto de entrada con lazy loading y fondo de estrellas global.

import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/layout/layout";
import StarField from "./components/ui/StarField";
import { CoverParticles } from "./components/ui/CoverParticles";

// ─── Code splitting ───────────────────────────────────────────────────────────
import Home from "./pages/Home";
const About       = lazy(() => import("./pages/About"));
const Projects    = lazy(() => import("./pages/Projects"));
const Newsletter  = lazy(() => import("./pages/Newsletter"));
const Contact     = lazy(() => import("./pages/Contact"));
const Admin       = lazy(() => import("./pages/Admin"));
const Privacy     = lazy(() => import("./pages/Privacy"));
const IntroAnimation = lazy(() => import("./components/animations/intro-animations"));
const ChatWidget     = lazy(() => import("./components/chat/ChatWidget").then(m => ({ default: m.ChatWidget })));

import { registerVisit } from "./services/api";

const PageSkeleton = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]" role="status">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      <span className="text-white/30 text-xs font-mono">Cargando...</span>
    </div>
  </div>
);

function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin") return;
    if (sessionStorage.getItem("adminToken")) return;

    const visitedPages: string[] = JSON.parse(sessionStorage.getItem("visitedPages") || "[]");
    if (visitedPages.includes(location.pathname)) return;
    visitedPages.push(location.pathname);
    sessionStorage.setItem("visitedPages", JSON.stringify(visitedPages));

    if (!sessionStorage.getItem("visitStart")) {
      sessionStorage.setItem("visitStart", Date.now().toString());
    }

    let referrer = "";
    if (visitedPages.length === 1) {
      const params = new URLSearchParams(location.search);
      const utmSource = params.get("utm_source");
      referrer = utmSource ? `utm:${utmSource}` : document.referrer;
    }

    registerVisit(location.pathname, referrer).catch(() => {});
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleUnload = () => {
      const start = sessionStorage.getItem("visitStart");
      if (!start) return;
      const seconds = Math.round((Date.now() - parseInt(start)) / 1000);
      if (seconds < 2) return;
      navigator.sendBeacon(
        "/api/visits/duration",
        new Blob([JSON.stringify({ seconds })], { type: "application/json" })
      );
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (sessionStorage.getItem("hasSeenIntro")) setShowIntro(false);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <>
      {/* ─── Fondo global: position fixed, cubre TODO el viewport incluyendo header ── */}
      <StarField />
      {!isMobile && <CoverParticles />}

      {showIntro && (
        <Suspense fallback={null}>
          <IntroAnimation onComplete={handleIntroComplete} />
        </Suspense>
      )}

      <BrowserRouter>
        <VisitTracker />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><About /></Suspense>} />
            <Route path="/projects" element={<Suspense fallback={<PageSkeleton />}><Projects /></Suspense>} />
            <Route path="/newsletter" element={<Suspense fallback={<PageSkeleton />}><Newsletter /></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><Contact /></Suspense>} />
            <Route path="/privacy" element={<Suspense fallback={<PageSkeleton />}><Privacy /></Suspense>} />
          </Route>
          <Route path="/admin" element={<Suspense fallback={<PageSkeleton />}><Admin /></Suspense>} />
        </Routes>
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
