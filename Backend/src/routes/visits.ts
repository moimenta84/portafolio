import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// POST /api/visits - Register a visit
router.post("/", (req, res) => {
  const ip = req.clientIp || "";
  const { page } = req.body;

  db.prepare("INSERT INTO visits (ip, page) VALUES (?, ?)").run(ip, page || "/");

  const total = db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits"
  ).get() as { c: number };

  res.json({ total_visits: total.c });
});

// GET /api/visits/count - Get visit count
router.get("/count", (_req, res) => {
  const total = db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits"
  ).get() as { c: number };

  const pageViews = db.prepare(
    "SELECT COUNT(*) as c FROM visits"
  ).get() as { c: number };

  res.json({
    unique_visitors: total.c,
    total_page_views: pageViews.c,
  });
});

// GET /api/visits/stats - Visitas por página + totales (admin)
router.get("/stats", requireAuth, (_req, res) => {
  const total = db.prepare(
    "SELECT COUNT(DISTINCT ip) as unique_visitors, COUNT(*) as total_page_views FROM visits"
  ).get() as { unique_visitors: number; total_page_views: number };

  const today = db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits WHERE created_at >= date('now')"
  ).get() as { c: number };

  const byPage = db.prepare(`
    SELECT page,
      COUNT(*) as views,
      COUNT(DISTINCT ip) as unique_visitors
    FROM visits
    GROUP BY page
    ORDER BY views DESC
  `).all() as { page: string; views: number; unique_visitors: number }[];

  res.json({
    unique_visitors: total.unique_visitors,
    total_page_views: total.total_page_views,
    today_visitors: today.c,
    by_page: byPage,
  });
});

export default router;
