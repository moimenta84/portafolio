// NavBar.tsx — Barra de navegación inferior con iconos.
// Recorre el array itemsNavbar para pintar cada icono como enlace.
// La ruta activa se resalta con fondo naranja (bg-cyan-500).
// Usa MotionTransition para animarse al aparecer.

import { Link, useLocation } from "react-router-dom";
import { itemsNavbar } from "../../data/itemsNavbar";
import { MotionTransition } from "../animations/transition-components";

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <MotionTransition
      position="right"
      className="w-full bg-darkBg/20 backdrop-blur-sm"
    >
      <nav className="py-4">
        <div className="flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-white/15 backdrop-blur-sm max-w-fit mx-auto">
          {itemsNavbar.map((item) => (
            <div
              key={item.id}
              className={`
                px-3 py-2 rounded-full cursor-pointer transition duration-150
                hover:bg-cyan-500
                ${pathname === item.link ? "bg-cyan-500" : ""}
              `}
            >
              <Link to={item.link}>{item.icon}</Link>
            </div>
          ))}
        </div>
      </nav>
    </MotionTransition>
  );
};

export default Navbar;