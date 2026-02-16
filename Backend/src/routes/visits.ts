import { Router } from "express";
import db from "../db/database.js";

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

export default router;
