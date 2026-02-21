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
    <div className="min-h-dvh flex flex-col bg-darkBg">
      <StarField />
      <CoverParticles />

      <header className="shrink-0 relative z-20">
        <Header />
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto relative z-10 flex flex-col">
        <Outlet />
      </main>

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
