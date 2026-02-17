// Header.tsx — Cabecera de la aplicación visible en todas las páginas.
// Contiene el logo "Iker Dev", el botón de seguir (con contador de seguidores
// obtenido de la API) y los enlaces a redes sociales.
// Las partículas de fondo solo se muestran en la Home (pathname === "/").

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, UserCheck } from "lucide-react";
import { MotionTransition } from "../animations/transition-components";
import { getFollowers, toggleFollow } from "../../services/api";

const Header = () => {
  const [followersCount, setFollowersCount] = useState(0);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    getFollowers()
      .then((data) => {
        setFollowersCount(data.followers_count);
        setFollowing(data.following);
      })
      .catch(console.error);
  }, []);

  const handleToggleFollow = async () => {
    try {
      const data = await toggleFollow();
      setFollowersCount(data.followers_count);
      setFollowing(data.following);
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  return (
    <MotionTransition
      position="bottom"
      className="w-full"
    >
      <header className="w-full relative z-10 border-b border-white/10" style={{ backgroundColor: "#0f172a" }}>
        <div className="flex items-center justify-between h-16 max-w-6xl mx-auto px-4 relative z-10">
          <Link to="/" className="group">
            <h1 className="text-xl sm:text-2xl font-mono text-white">
              <span className="text-cyan-400">&lt;</span>iker.martinez<span className="text-cyan-400"> /&gt;</span>
            </h1>
          </Link>

          <button
            onClick={handleToggleFollow}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              following
                ? "bg-secondary text-white shadow-lg shadow-secondary/25"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
            }`}
          >
            {following ? <UserCheck size={14} /> : <UserPlus size={14} />}
            <span className="hidden sm:inline">{following ? "Siguiendo" : "Seguir"}</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
              {followersCount}
            </span>
          </button>
        </div>
      </header>
    </MotionTransition>
  );
};

export default Header;
