// Layout.tsx — Layout principal con fondo espacial global.
// Scroll de ventana (no de contenedor) para evitar problemas de ancho
// con scrollbars que rompían el grid de Newsletter y el centrado de páginas.

import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import StarField from "../ui/StarField";
import { CoverParticles } from "../ui/CoverParticles";
import { FollowProvider } from "../../contexts/FollowContext";

const Layout = () => {
  return (
    <FollowProvider>
      <div className="min-h-dvh flex flex-col bg-darkBg">
        <StarField />
        <CoverParticles />

        <header className="shrink-0 sticky top-0 z-20">
          <Header />
        </header>

        <main className="flex-1 relative z-10 flex flex-col overflow-x-hidden">
          <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-4 md:px-10">
            <Outlet />
          </div>
        </main>

        <footer className="shrink-0 relative z-20">
          <Footer />
        </footer>

        <nav className="sticky bottom-0 shrink-0 z-20">
          <NavBar />
        </nav>
      </div>
    </FollowProvider>
  );
};

export default Layout;
