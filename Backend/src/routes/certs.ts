import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// POST /api/certs/view — registra una visualización de certificado
router.post("/view", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "name requerido" });
    return;
  }
  const ip = (req as any).ip_address || req.ip || "unknown";
  db.prepare("INSERT INTO cert_views (cert_name, ip) VALUES (?, ?)").run(name.trim(), ip);
  res.json({ ok: true });
});

// GET /api/certs/stats — estadísticas para el admin (requiere auth)
router.get("/stats", requireAuth, (_req, res) => {
  const rows = db.prepare(`
    SELECT
      cert_name,
      COUNT(*) as views,
      COUNT(DISTINCT ip) as unique_views,
      MAX(created_at) as last_view
    FROM cert_views
    GROUP BY cert_name
    ORDER BY views DESC
  `).all();
  res.json(rows);
});

export default router;
