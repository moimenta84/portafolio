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

  // Obtener últimas noticias del caché (news_cache almacena JSON por fuente)
  let articles: { title: string; url: string; source: string }[] = [];
  try {
    const rows = db.prepare("SELECT data FROM news_cache LIMIT 5").all() as { data: string }[];
    articles = rows
      .flatMap((row) => {
        try { return JSON.parse(row.data); } catch { return []; }
      })
      .slice(0, 5)
      .map((a: any) => ({ title: a.title, url: a.url, source: a.source }));
  } catch {
    // Si no hay caché todavía, se envía el email sin noticias
  }

  // Email de bienvenida con noticias
  await sendEmail(
    email,
    "🚀 ¡Bienvenido al newsletter de Iker Martínez Dev!",
    welcomeEmailHtml(articles)
  );

  res.json({ ok: true });
});

export default router;
