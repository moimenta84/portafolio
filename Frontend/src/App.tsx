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
import Privacy from "./pages/Privacy";
import IntroAnimation from "./components/animations/intro-animations";
import { registerVisit } from "./services/api";

// Componente invisible que registra cada visita de página en el backend.
// Se ejecuta cada vez que cambia la ruta gracias a useLocation().


// Registra cada página única visitada por sesión con referrer real, y envía la duración al salir.
// - Omite la página /admin
// - Omite visitas del propio administrador (si hay token JWT en sessionStorage)
// - Registra cada ruta única una vez por sesión (no solo la primera)
// - Lee UTM source de la URL para detectar tráfico de redes sociales (apps móviles suprimen el referrer)
function VisitTracker() {
  const location = useLocation();

  useEffect(() => {
    // No registrar visitas del admin ni de la propia página de admin
    if (location.pathname === "/admin") return;
    if (sessionStorage.getItem("adminToken")) return;

    // Registrar cada ruta única una sola vez por sesión
    const visitedPages: string[] = JSON.parse(sessionStorage.getItem("visitedPages") || "[]");
    if (visitedPages.includes(location.pathname)) return;
    visitedPages.push(location.pathname);
    sessionStorage.setItem("visitedPages", JSON.stringify(visitedPages));

    // Arrancar el cronómetro de duración solo en la primera página de la sesión
    if (!sessionStorage.getItem("visitStart")) {
      sessionStorage.setItem("visitStart", Date.now().toString());
    }

    // Referrer real: en la primera página mirar UTM source o document.referrer;
    // en navegación interna no enviar referrer externo (evita atribuir todas las
    // páginas al mismo origen de entrada)
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
            <Route path="/privacy" element={<Privacy />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
