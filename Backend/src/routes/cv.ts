import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// POST /api/cv/download - Registrar una descarga de CV
router.post("/download", (req, res) => {
  const ip = req.clientIp || "";
  db.prepare("INSERT INTO cv_downloads (ip) VALUES (?)").run(ip);

  const total = db.prepare(
    "SELECT COUNT(*) as c FROM cv_downloads"
  ).get() as { c: number };

  res.json({ total_downloads: total.c });
});

// GET /api/cv/downloads - Estadísticas de descargas (admin)
router.get("/downloads", requireAuth, (_req, res) => {
  const total = db.prepare(
    "SELECT COUNT(*) as c FROM cv_downloads"
  ).get() as { c: number };

  const unique = db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM cv_downloads"
  ).get() as { c: number };

  const today = db.prepare(
    "SELECT COUNT(*) as c FROM cv_downloads WHERE created_at >= date('now')"
  ).get() as { c: number };

  res.json({
    total_downloads: total.c,
    unique_downloads: unique.c,
    today_downloads: today.c,
  });
});

export default router;
