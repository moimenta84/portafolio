// App.tsx — Punto de entrada principal de la aplicación.
// Aquí se define el sistema de rutas (React Router) y se controla
// la animación de intro que solo se muestra una vez por sesión.

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/layout/layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Newsletter from "./pages/Newsletter";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import IntroAnimation from "./components/animations/intro-animations";
import { registerVisit } from "./services/api";

// Componente invisible que registra cada visita de página en el backend.
// Se ejecuta cada vez que cambia la ruta gracias a useLocation().


// Registra UNA sola visita por sesión con referrer, y envía la duración al salir.
function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin") return;
    if (sessionStorage.getItem("visitRegistered")) return;
    sessionStorage.setItem("visitRegistered", "true");
    sessionStorage.setItem("visitStart", Date.now().toString());
    registerVisit(location.pathname, document.referrer).catch(() => {});
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      const start = sessionStorage.getItem("visitStart");
      if (!start) return;
      const seconds = Math.round((Date.now() - parseInt(start)) / 1000);
      if (seconds < 2) return;
      const blob = new Blob(
        [JSON.stringify({ seconds })],
        { type: "application/json" }
      );
      navigator.sendBeacon("/api/visits/duration", blob);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return null;
}

function App() {
  const [showIntro, setShowIntro] = useState(true);

  // Al montar, comprobamos si el usuario ya vio la intro en esta sesión.
  // Si ya la vio (guardado en sessionStorage), la ocultamos directamente.
  useEffect(() => {
    const seen = sessionStorage.getItem("hasSeenIntro");
    if (seen) {
      setShowIntro(false);
    }
  }, []);

  // Cuando termina la animación de intro, la ocultamos y
  // guardamos en sessionStorage para no volver a mostrarla.
  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <>
      {/* Animación de intro (bombilla que se enciende) — solo la primera vez */}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <BrowserRouter>
        <VisitTracker />
        {/* Todas las rutas comparten el Layout (Header + Navbar + contenido) */}
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
