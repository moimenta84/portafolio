import { Router } from "express";
import crypto from "crypto";
import db from "../db/database.js";
import { sendEmail, followWelcomeEmailHtml } from "../services/notifications.js";
import { getGeoData, isPrivateIp } from "../utils/geo.js";

const router = Router();

// POST /api/followers/email - Seguir con email (registra follow + guarda email)
router.post("/email", async (req, res) => {
  const { email } = req.body;
  const ip = req.clientIp || "";

  if (!email || !email.includes("@")) {
    res.status(400).json({ error: "Email no válido" });
    return;
  }

  // Registrar follow por IP si no existe
  const existingFollow = db.prepare("SELECT id FROM followers WHERE ip = ?").get(ip);
  if (!existingFollow) {
    db.prepare("INSERT INTO followers (ip) VALUES (?)").run(ip);
  }

  // Guardar email en subscribers si es nuevo
  const existingSub = db
    .prepare("SELECT id FROM subscribers WHERE email = ?")
    .get(email);

  if (!existingSub) {
    const token = crypto.randomUUID();
    let city = "", region = "", country = "";
    if (!isPrivateIp(ip)) {
      const geo = await getGeoData(ip);
      if (geo) ({ city, region, country } = geo);
    }
    db.prepare(
      "INSERT INTO subscribers (email, unsubscribe_token, city, region, country, source) VALUES (?, ?, ?, ?, ?, 'follow')"
    ).run(email, token, city, region, country);
    console.log(`[followers] Enviando email de bienvenida a ${email}`);
    await sendEmail(
      email,
      "👋 ¡Gracias por seguirme! — Iker Martínez Dev",
      followWelcomeEmailHtml(token)
    );
    console.log(`[followers] Email enviado correctamente a ${email}`);
  }

  const count = db.prepare("SELECT COUNT(*) as c FROM followers").get() as { c: number };
  res.json({ followers_count: count.c, following: true });
});

// POST /api/followers/toggle - Toggle follow (solo IP, para dejar de seguir)
router.post("/toggle", (req, res) => {
  const ip = req.clientIp || "";

  const existing = db.prepare("SELECT id FROM followers WHERE ip = ?").get(ip);

  if (existing) {
    db.prepare("DELETE FROM followers WHERE ip = ?").run(ip);
  } else {
    db.prepare("INSERT INTO followers (ip) VALUES (?)").run(ip);
  }

  const count = db.prepare("SELECT COUNT(*) as c FROM followers").get() as { c: number };

  res.json({
    followers_count: count.c,
    following: !existing,
  });
});

// GET /api/followers - Get followers info
router.get("/", (req, res) => {
  const ip = req.clientIp || "";

  const count = db.prepare("SELECT COUNT(*) as c FROM followers").get() as { c: number };
  const following = db.prepare("SELECT id FROM followers WHERE ip = ?").get(ip);

  res.json({
    followers_count: count.c,
    following: !!following,
  });
});

export default router;
