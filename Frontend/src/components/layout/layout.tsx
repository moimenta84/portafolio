// Layout.tsx

import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-950 to-slate-900 overflow-hidden">
      
      {/* Header */}
      <header className="shrink-0 relative z-10">
        <Header />
      </header>

      {/* Contenido scrollable */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
        <Outlet />
      </main>

      {/* Footer + Navbar fijos abajo */}
      <footer className="shrink-0">
        <Footer />
      </footer>
      <nav className="shrink-0 relative z-10">
        <NavBar />
      </nav>

    </div>
  );
};

export default Layout;
