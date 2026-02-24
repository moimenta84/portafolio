// ReviewSection.tsx — Sistema de opiniones/reviews con estrellas.
// Los usuarios pueden dejar una valoración (1-5 estrellas) y un comentario.
// Se muestra la media de todas las valoraciones y la lista de reviews.
// Las reviews se guardan en el backend (createReview) y se cargan al montar (getReviews).

import { useState, useEffect } from "react";
import { Star, Send, MessageSquare, User } from "lucide-react";
import { getReviews, createReview } from "../../services/api";
import type { Review } from "../../types";

const ReviewSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Escribe tu nombre"); return; }
    if (rating === 0) { setError("Selecciona una valoración"); return; }
    if (!comment.trim()) { setError("Escribe un comentario"); return; }

    setSubmitting(true);
    try {
      const newReview = await createReview({
        name: name.trim(),
        comment: comment.trim(),
        rating,
      });
      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setComment("");
      setRating(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error al enviar. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="mt-3 max-w-6xl mx-auto w-full shrink-0 overflow-x-hidden">
      {/* Header + Form en una fila */}
      <div className="grid md:grid-cols-[auto_1fr] gap-4 items-start">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded-full text-xs font-medium">
            <MessageSquare size={12} />
            Opiniones
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white/20"
                    }
                  />
                ))}
              </div>
              <span className="text-white/60 text-xs">
                {averageRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}
        </div>

        {/* Formulario responsive */}
        <div className="flex flex-col gap-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Nombre"
                className="w-20 sm:w-24 px-2 py-1 bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none text-xs shrink-0"
              />
              <div className="flex items-center gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => { setRating(star); setError(""); }}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-0.5 transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      size={16}
                      className={
                        star <= (hoveredStar || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/40 hover:text-yellow-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={comment}
                onChange={(e) => { setComment(e.target.value); setError(""); }}
                placeholder="Tu opinión..."
                className="flex-1 min-w-0 px-2 py-1 bg-transparent border-none text-white placeholder:text-white/40 focus:outline-none text-xs"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {success && (
                <span className="text-green-400 text-xs whitespace-nowrap">✓ Enviada</span>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-400 disabled:opacity-50 text-white font-semibold rounded-lg transition-all text-xs shrink-0 cursor-pointer hover:opacity-90"
              >
                <Send size={10} />
                {submitting ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </form>
          {error && (
            <p className="text-red-400 text-xs px-1">{error}</p>
          )}
        </div>
      </div>

      {/* Lista de reviews */}
      {reviews.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center">
                    <User size={12} className="text-white" />
                  </div>
                  <span className="font-medium text-white text-sm">{review.name}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/15"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/70">{review.comment}</p>
              <p className="text-xs text-white/50 mt-1">{formatDate(review.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
