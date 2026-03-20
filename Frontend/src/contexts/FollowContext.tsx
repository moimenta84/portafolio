// FollowContext.tsx — Estado global del botón de seguir.
// Gestiona: contador, estado following, modal y llamadas a la API.
// El modal se renderiza aquí (una sola instancia en todo el DOM).

import { useState, useEffect, useRef, type ReactNode } from "react";
import { X, Send } from "lucide-react";
import { getFollowers, toggleFollow } from "../services/api";
import { FollowContext } from "./FollowContextCore";

export function FollowProvider({ children }: { children: ReactNode }) {
  const [followersCount, setFollowersCount] = useState(0);
  const [following, setFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFollowers()
      .then((data) => {
        setFollowersCount(data.followers_count);
        setFollowing(data.following);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setEmail("");
      setStatus("idle");
    }
  }, [showModal]);

  const openModal = () => setShowModal(true);

  const handleUnfollow = async () => {
    try {
      const data = await toggleFollow();
      setFollowersCount(data.followers_count);
      setFollowing(data.following);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/followers/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setFollowersCount(data.followers_count);
      setFollowing(true);
      setStatus("ok");
      setTimeout(() => setShowModal(false), 2000);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FollowContext.Provider value={{ followersCount, following, openModal, handleUnfollow }}>
      {children}

      {/* Modal global — una sola instancia en el DOM */}
      {showModal && (
        <>
          {/* Backdrop clickable */}
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          {/* Contenido del modal — pointer-events-none en el wrapper para no bloquear el backdrop */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="relative w-full max-w-xs bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl pointer-events-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition"
            >
              <X size={16} />
            </button>

            {status === "ok" ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">🎉</div>
                <h3 className="text-white font-bold text-lg mb-1">¡Gracias por seguirme!</h3>
                <p className="text-white/50 text-sm">Te avisaré cuando publique nuevos proyectos.</p>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <h3 className="text-white font-bold text-base mb-1">Seguir a Iker Martínez Dev</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Déjame tu email y te aviso cuando publique nuevos proyectos o novedades.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    ref={inputRef}
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 text-sm transition"
                  />
                  {status === "error" && (
                    <p className="text-red-400 text-xs">Algo salió mal. Inténtalo de nuevo.</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white font-semibold rounded-lg transition text-sm"
                  >
                    <Send size={14} />
                    {loading ? "Enviando..." : "Seguir y recibir novedades"}
                  </button>
                </form>

                <p className="text-white/25 text-[11px] text-center mt-3">
                  Sin spam. Puedes darte de baja cuando quieras.
                </p>
              </>
            )}
          </div>
          </div>
        </>
      )}
    </FollowContext.Provider>
  );
}
