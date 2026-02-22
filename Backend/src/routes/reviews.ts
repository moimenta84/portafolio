import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { logAudit } from "../utils/audit.js";

const router = Router();

// GET /api/reviews - Top 3 reviews by rating (public)
router.get("/", (_req, res) => {
  const reviews = db
    .prepare("SELECT id, name, comment, rating, created_at FROM reviews ORDER BY rating DESC, created_at DESC LIMIT 3")
    .all();

  res.json(reviews);
});

// GET /api/reviews/all - All reviews (admin)
router.get("/all", requireAuth, (_req, res) => {
  const reviews = db
    .prepare("SELECT id, name, comment, rating, ip, created_at FROM reviews ORDER BY created_at DESC")
    .all();

  res.json(reviews);
});

// POST /api/reviews - Create a review
router.post("/", (req, res) => {
  const { name, comment, rating } = req.body;
  const ip = req.clientIp || "";

  if (!name || !comment || !rating) {
    res.status(400).json({ error: "Nombre, comentario y valoración son obligatorios" });
    return;
  }

  const numRating = Number(rating);
  if (numRating < 1 || numRating > 5) {
    res.status(400).json({ error: "La valoración debe ser entre 1 y 5" });
    return;
  }

  const result = db
    .prepare("INSERT INTO reviews (name, comment, rating, ip) VALUES (?, ?, ?, ?)")
    .run(name.trim(), comment.trim(), numRating, ip);

  const review = db.prepare("SELECT id, name, comment, rating, created_at FROM reviews WHERE id = ?").get(result.lastInsertRowid);

  res.status(201).json(review);
});

// DELETE /api/reviews/:id - Delete a review (admin)
router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const ip = req.clientIp || "";

  const existing = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as any;
  if (!existing) {
    res.status(404).json({ error: "Review no encontrada" });
    return;
  }

  db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
  logAudit("REVIEW_DELETE", `Reseña eliminada de "${existing.name}" (${existing.rating}★)`, ip);
  res.json({ message: "Review eliminada" });
});

export default router;
