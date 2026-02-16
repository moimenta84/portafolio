// Header.tsx — Cabecera de la aplicación visible en todas las páginas.
// Contiene el logo "Iker Dev", el botón de seguir (con contador de seguidores
// obtenido de la API) y los enlaces a redes sociales.
// Las partículas de fondo solo se muestran en la Home (pathname === "/").

import { useState, useEffect } from "react";
import { socialNetworks } from "../../data/social";
import { Link, useLocation } from "react-router-dom";
import { UserPlus, UserCheck } from "lucide-react";
import { MotionTransition } from "../animations/transition-components";
import { CoverParticles } from "../ui/CoverParticles";
import { getFollowers, toggleFollow } from "../../services/api";

const Header = () => {
  const location = useLocation();
  // Solo mostramos partículas en la página principal
  const showParticles = location.pathname === "/";

  const [followersCount, setFollowersCount] = useState(0);
  const [following, setFollowing] = useState(false);

  // Al cargar, obtenemos los datos de seguidores desde la API
  useEffect(() => {
    getFollowers()
      .then((data) => {
        setFollowersCount(data.followers_count);
        setFollowing(data.following);
      })
      .catch(console.error);
  }, []);

  // Alterna entre seguir/dejar de seguir haciendo POST a la API
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
      className="w-full h-24"
    >
      <header className="w-full h-full relative z-10 border-b border-white/10" style={{ backgroundColor: "#1b1026" }}>
        {showParticles && <CoverParticles />}

        <div className="flex items-center justify-between h-full max-w-6xl mx-auto px-4 relative z-10">
          <Link to="/">
            <h1 className="text-4xl font-bold text-white">
              Iker <span className="text-orange-400">Dev</span>
            </h1>
          </Link>

          <div className="flex items-center gap-5">
            <button
              onClick={handleToggleFollow}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                following
                  ? "bg-secondary text-white shadow-lg shadow-secondary/25"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              }`}
            >
              {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
              <span>{following ? "Siguiendo" : "Seguir"}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {followersCount}
              </span>
            </button>

            <div className="hidden md:flex items-center gap-5 text-white">
              {socialNetworks.map(({ logo, src, id }) => (
                <a key={id} href={src} target="_blank" rel="noreferrer">
                  {logo}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>
    </MotionTransition>
  );
};

export default Header;
