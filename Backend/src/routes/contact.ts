import { Router } from "express";
import { sendEmail, sendTelegram, contactEmailHtml } from "../services/notifications.js";

const router = Router();

// POST /api/contact - Recibir formulario de contacto
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

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
