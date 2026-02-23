// Header.tsx — Solo logo. El botón de seguir vive en Home y Footer.

import { Link } from "react-router-dom";
import { MotionTransition } from "../animations/transition-components";

const Header = () => {
  return (
    <MotionTransition position="bottom" className="w-full">
      <div className="w-full relative z-10 bg-transparent">
        <div className="flex items-center h-16 max-w-6xl mx-auto px-4">
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
