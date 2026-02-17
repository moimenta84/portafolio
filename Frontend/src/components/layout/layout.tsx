// Layout.tsx — Layout principal con fondo espacial global.
// Las partículas y estrellas se renderizan como capas fixed (z-0 y z-1)
// que cubren toda la ventana sin cortes entre header, contenido y footer.

import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import StarField from "../ui/StarField";
import { CoverParticles } from "../ui/CoverParticles";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-darkBg overflow-hidden">

      {/* Capas de fondo global — fixed, cubren toda la ventana */}
      <StarField />
      <CoverParticles />

      {/* Header — transparente para que se vean las partículas detrás */}
      <header className="shrink-0 relative z-20">
        <Header />
      </header>

      {/* Contenido scrollable */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
        <Outlet />
      </main>

      {/* Footer + Navbar fijos abajo */}
      <footer className="shrink-0 relative z-20">
        <Footer />
      </footer>
      <nav className="shrink-0 relative z-20">
        <NavBar />
      </nav>

    </div>
  );
};

export default Layout;
