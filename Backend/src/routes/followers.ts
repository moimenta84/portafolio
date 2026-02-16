import { Router } from "express";
import db from "../db/database.js";

const router = Router();

// POST /api/followers/toggle - Toggle follow
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
