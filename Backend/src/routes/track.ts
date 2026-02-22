import { Router } from "express";
import db from "../db/database.js";

const router = Router();

// GIF 1x1 transparente
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

// GET /api/track/open/:sendId/:subscriberId
// Registra la apertura del email y devuelve el píxel transparente
router.get("/open/:sendId/:subscriberId", (req, res) => {
  const sendId = Number(req.params.sendId);
  const subscriberId = Number(req.params.subscriberId);

  if (!isNaN(sendId) && !isNaN(subscriberId)) {
    // INSERT OR IGNORE: la restricción UNIQUE evita contar dobles aperturas
    db.prepare(
      "INSERT OR IGNORE INTO newsletter_opens (send_id, subscriber_id) VALUES (?, ?)"
    ).run(sendId, subscriberId);
  }

  res.set("Content-Type", "image/gif");
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.set("Pragma", "no-cache");
  res.send(PIXEL);
});

export default router;
