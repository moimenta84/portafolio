// Header.tsx — Transparente en top, añade blur al hacer scroll.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MotionTransition } from "../animations/transition-components";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionTransition position="bottom" className="w-full">
      <div
        className="w-full relative z-10 transition-all duration-300"
        style={
          scrolled
            ? {
                background: "rgba(10, 10, 10, 0.6)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }
            : {
                background: "transparent",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                borderBottom: "none",
              }
        }
      >
        <div className="flex items-center justify-between h-16 max-w-6xl mx-auto px-4">
          <Link to="/" aria-label="Ir al inicio">
            <span className="text-xl sm:text-2xl font-mono text-white">
              <span className="text-cyan-400">&lt;</span>iker.martinez<span className="text-cyan-400"> /&gt;</span>
            </span>
          </Link>
        </div>
      </div>
    </MotionTransition>
  );
};

export default Header;
