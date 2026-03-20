import { Outlet } from "react-router-dom";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { FollowProvider } from "../../contexts/FollowContext";

const Layout = () => {
  return (
    <FollowProvider>
      {/* Sin bg-darkBg aquí — el fondo lo pone el body y las estrellas vienen de App */}
      <div className="min-h-dvh flex flex-col">

        <header className="shrink-0 sticky top-0 z-20" role="banner">
          <Header />
        </header>

        <main
          id="main-content"
          className="flex-1 relative z-[1] flex flex-col overflow-x-hidden"
          role="main"
          tabIndex={-1}
        >
          <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-4 md:px-10">
            <Outlet />
          </div>
        </main>

        <footer className="shrink-0 relative z-20" role="contentinfo">
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
