import { Router } from "express";
import db from "../db/database.js";

const router = Router();

// POST /api/projects/:id/like - Toggle like
router.post("/:id/like", (req, res) => {
  const ip = req.clientIp || "";
  const projectId = req.params.id;

  const project = db.prepare("SELECT id FROM projects WHERE id = ?").get(projectId);
  if (!project) {
    res.status(404).json({ error: "Proyecto no encontrado" });
    return;
  }

  const existing = db.prepare(
    "SELECT id FROM likes WHERE project_id = ? AND ip = ?"
  ).get(projectId, ip);

  if (existing) {
    db.prepare("DELETE FROM likes WHERE project_id = ? AND ip = ?").run(projectId, ip);
  } else {
    db.prepare("INSERT INTO likes (project_id, ip) VALUES (?, ?)").run(projectId, ip);
  }

  const count = db.prepare(
    "SELECT COUNT(*) as c FROM likes WHERE project_id = ?"
  ).get(projectId) as { c: number };

  res.json({
    likes_count: count.c,
    liked: !existing,
  });
});

// GET /api/projects/:id/likes - Get likes info
router.get("/:id/likes", (req, res) => {
  const ip = req.clientIp || "";
  const projectId = req.params.id;

  const count = db.prepare(
    "SELECT COUNT(*) as c FROM likes WHERE project_id = ?"
  ).get(projectId) as { c: number };

  const liked = db.prepare(
    "SELECT id FROM likes WHERE project_id = ? AND ip = ?"
  ).get(projectId, ip);

  res.json({
    likes_count: count.c,
    liked: !!liked,
  });
});

export default router;
