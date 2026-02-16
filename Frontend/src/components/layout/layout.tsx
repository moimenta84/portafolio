// Layout.tsx — Estructura visual principal que envuelve todas las páginas.
// Usa flexbox vertical: Header arriba, contenido scrollable en medio, Navbar abajo.
// El fondo degradado púrpura se aplica aquí para toda la app.
// <Outlet /> es donde React Router renderiza la página activa (Home, About, etc.).

import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-800 via-violet-900 to-purple-900 overflow-hidden">
      {/* Header fijo con logo, botón de seguir y redes sociales */}
      <header className="shrink-0 relative z-10">
        <Header />
      </header>

      {/* Área de contenido principal — aquí se renderiza cada página */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </main>

      {/* Navbar fija en la parte inferior con iconos de navegación */}
      <nav className="shrink-0 relative z-10">
        <NavBar />
      </nav>
    </div>
  );
};

export default Layout;
