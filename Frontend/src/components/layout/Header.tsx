// Header.tsx — Solo logo. El botón de seguir vive en Home y Footer.

import { Link } from "react-router-dom";
import { MotionTransition } from "../animations/transition-components";

const Header = () => {
  return (
    <MotionTransition position="bottom" className="w-full">
      <header className="w-full relative z-10 bg-transparent backdrop-blur-sm">
        <div className="flex items-center h-16 max-w-6xl mx-auto px-4">
          <Link to="/">
            <h1 className="text-xl sm:text-2xl font-mono text-white">
              <span className="text-cyan-400">&lt;</span>iker.martinez<span className="text-cyan-400"> /&gt;</span>
            </h1>
          </Link>
        </div>
      </header>
    </MotionTransition>
  );
};

export default Header;
