import { Router } from "express";
import db from "../db/database.js";
import { sendEmail, welcomeEmailHtml } from "../services/notifications.js";

const router = Router();

// POST /api/subscribers - Suscribirse al newsletter
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Email no válido" });
    return;
  }

  // Intentar insertar (falla si ya existe por UNIQUE)
  const existing = db.prepare("SELECT id FROM subscribers WHERE email = ?").get(email);
  if (existing) {
    res.json({ ok: true, already: true });
    return;
  }

  db.prepare("INSERT INTO subscribers (email) VALUES (?)").run(email);

  // Obtener últimas noticias del caché RSS
  const articles = db.prepare(
    "SELECT title, url, source FROM rss_cache ORDER BY published_at DESC LIMIT 5"
  ).all() as { title: string; url: string; source: string }[];

  // Email de bienvenida con noticias
  await sendEmail(
    email,
    "🚀 ¡Bienvenido al newsletter de Iker Martínez Dev!",
    welcomeEmailHtml(articles)
  );

  res.json({ ok: true });
});

export default router;
