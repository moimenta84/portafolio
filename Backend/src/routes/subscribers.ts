import { Router } from "express";
import crypto from "crypto";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getGeoData, isPrivateIp } from "../utils/geo.js";
import { dispatchToAll, dispatchToOne } from "../services/newsletter.js";

const router = Router();

// POST /api/subscribers - Suscribirse al newsletter
router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Email no válido" });
    return;
  }

  const existing = db.prepare("SELECT id FROM subscribers WHERE email = ?").get(email);
  if (existing) {
    res.json({ ok: true, already: true });
    return;
  }

  const token = crypto.randomUUID();
  const ip = req.clientIp || "";
  let city = "", region = "", country = "";
  if (!isPrivateIp(ip)) {
    const geo = await getGeoData(ip);
    if (geo) ({ city, region, country } = geo);
  }
  db.prepare(
    "INSERT INTO subscribers (email, unsubscribe_token, city, region, country) VALUES (?, ?, ?, ?, ?)"
  ).run(email, token, city, region, country);

  console.log(`[subscribers] Enviando email de bienvenida a ${email}`);
  await dispatchToOne(email, token);
  console.log(`[subscribers] Email enviado correctamente a ${email}`);

  res.json({ ok: true });
});

// GET /api/subscribers - Listar todos los suscriptores (admin)
router.get("/", requireAuth, (_req, res) => {
  const rows = db
    .prepare("SELECT id, email, city, region, country, source, created_at FROM subscribers ORDER BY created_at DESC")
    .all();
  res.json(rows);
});

// POST /api/subscribers/send-newsletter - Enviar newsletter a todos los suscriptores (manual desde admin)
router.post("/send-newsletter", requireAuth, async (_req, res) => {
  const result = await dispatchToAll();
  res.json({ ok: true, ...result });
});

// GET /api/subscribers/history - Historial de newsletters enviados (admin)
router.get("/history", requireAuth, (_req, res) => {
  const rows = db
    .prepare("SELECT id, sent_at, total, sent, errors FROM newsletter_sends ORDER BY sent_at DESC LIMIT 20")
    .all();
  res.json(rows);
});

// DELETE /api/subscribers/:id - Eliminar suscriptor (admin)
router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM subscribers WHERE id = ?").run(id);
  res.json({ ok: true });
});

// GET /api/subscribers/unsubscribe?token=XXX - Darse de baja
router.get("/unsubscribe", (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).send(unsubscribeHtml(false));
    return;
  }

  const subscriber = db
    .prepare("SELECT id FROM subscribers WHERE unsubscribe_token = ?")
    .get(token);

  if (!subscriber) {
    res.status(404).send(unsubscribeHtml(false));
    return;
  }

  db.prepare("DELETE FROM subscribers WHERE unsubscribe_token = ?").run(token);
  res.send(unsubscribeHtml(true));
});

function unsubscribeHtml(success: boolean) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${success ? "Baja confirmada" : "Enlace no válido"} — Iker Martínez Dev</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { max-width: 420px; width: 90%; text-align: center; padding: 48px 32px; background: #1e293b; border-radius: 16px; border: 1px solid #334155; }
    h1 { font-size: 1.5rem; color: ${success ? "#22d3ee" : "#f87171"}; margin-bottom: 12px; }
    p { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; }
    a { display: inline-block; margin-top: 28px; padding: 10px 28px; background: #22d3ee; color: #0f172a; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.9rem; }
    a:hover { background: #67e8f9; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${success ? "✅ Baja confirmada" : "❌ Enlace no válido"}</h1>
    <p>${
      success
        ? "Has sido dado de baja correctamente. No recibirás más correos."
        : "El enlace de baja no es válido o ya fue utilizado."
    }</p>
    <a href="https://ikermartinezdev.com">Volver al portafolio</a>
  </div>
</body>
</html>`;
}

export default router;
