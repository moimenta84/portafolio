import { useState, useEffect } from "react";
import { Star, Trash2, Lock } from "lucide-react";
import { getAllReviews, deleteReview } from "../services/api";
import type { Review } from "../types";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "";

const Admin = () => {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("adminAuth") === "true"
  );
  const [input, setInput] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setAuthed(true);
    } else {
      setInput("");
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    getAllReviews()
      .then(setReviews)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authed]);

  const handleDelete = async (id: number) => {
    await deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBg">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-8 w-72"
        >
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Lock size={16} />
            <span className="text-sm font-semibold">Acceso restringido</span>
          </div>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-cyan-400/50"
          />
          <button
            type="submit"
            className="py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-white font-semibold rounded-lg text-sm cursor-pointer hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg px-6 py-10 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Reseñas recibidas</h1>
            {reviews.length > 0 && (
              <p className="text-xs text-white/40 mt-1">
                {reviews.length} reseña{reviews.length !== 1 ? "s" : ""} ·{" "}
                media {avgRating.toFixed(1)} ★
              </p>
            )}
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              setAuthed(false);
            }}
            className="text-xs text-white/30 hover:text-white/60 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <p className="text-white/30 text-sm text-center py-12">
            Todavía no hay reseñas.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-white">
                      {review.name}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={11}
                          className={
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/15"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {review.comment}
                  </p>
                  <p className="text-[10px] text-white/30 mt-2">
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-white/20 hover:text-red-400 transition-colors cursor-pointer shrink-0 mt-0.5"
                  title="Eliminar"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
