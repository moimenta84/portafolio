import { Router, type Request } from "express";
import { sendEmail, sendTelegram, contactEmailHtml } from "../services/notifications.js";
import { validate, contactSchema } from "../middleware/validate.js";
import db from "../db/database.js";

const router = Router();

// POST /api/contact - Recibir formulario de contacto
router.post("/", validate(contactSchema), async (req: Request, res) => {
  const { name, email, subject, message } = req.body;
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip ?? "";

  // Guardar en DB siempre
  db.prepare("INSERT INTO contacts (name, email, subject, message, ip) VALUES (?, ?, ?, ?, ?)")
    .run(name, email, subject, message, ip);

  // Email al admin
  await sendEmail(
    "moimenta267@gmail.com",
    `📩 Nuevo contacto: ${subject}`,
    contactEmailHtml(name, email, subject, message)
  );

  // Notificación Telegram
  await sendTelegram(
    `📩 <b>Nuevo contacto en tu portfolio</b>\n\n` +
    `👤 <b>${name}</b> (${email})\n` +
    `📌 ${subject}\n\n` +
    `💬 ${message.slice(0, 300)}${message.length > 300 ? "..." : ""}`
  );

  res.json({ ok: true });
});

export default router;
