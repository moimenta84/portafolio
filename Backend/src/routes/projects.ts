import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// GET /api/projects - List all projects with like counts
router.get("/", (req, res) => {
  const ip = req.clientIp || "";

  const projects = db.prepare(`
    SELECT p.*,
      (SELECT COUNT(*) FROM likes WHERE project_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM likes WHERE project_id = p.id AND ip = ?) as liked
    FROM projects p
    ORDER BY p.id ASC
  `).all(ip);

  const parsed = (projects as any[]).map((p) => ({
    ...p,
    tech: JSON.parse(p.tech || "[]"),
    liked: p.liked > 0,
  }));

  res.json(parsed);
});

// GET /api/projects/:id - Get single project
router.get("/:id", (req, res) => {
  const ip = req.clientIp || "";
  const { id } = req.params;

  const project = db.prepare(`
    SELECT p.*,
      (SELECT COUNT(*) FROM likes WHERE project_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM likes WHERE project_id = p.id AND ip = ?) as liked
    FROM projects p
    WHERE p.id = ?
  `).get(ip, id) as any;

  if (!project) {
    res.status(404).json({ error: "Proyecto no encontrado" });
    return;
  }

  res.json({
    ...project,
    tech: JSON.parse(project.tech || "[]"),
    liked: project.liked > 0,
  });
});

// POST /api/projects - Create project
router.post("/", requireAuth, (req, res) => {
  const { title, description, image, tech, link } = req.body;

  if (!title) {
    res.status(400).json({ error: "El título es obligatorio" });
    return;
  }

  const result = db.prepare(
    "INSERT INTO projects (title, description, image, tech, link) VALUES (?, ?, ?, ?, ?)"
  ).run(title, description || "", image || "", JSON.stringify(tech || []), link || "");

  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid) as any;

  res.status(201).json({
    ...project,
    tech: JSON.parse(project.tech || "[]"),
    likes_count: 0,
    liked: false,
  });
});

// PUT /api/projects/:id - Update project
router.put("/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { title, description, image, tech, link } = req.body;

  const existing = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  if (!existing) {
    res.status(404).json({ error: "Proyecto no encontrado" });
    return;
  }

  db.prepare(
    "UPDATE projects SET title = ?, description = ?, image = ?, tech = ?, link = ? WHERE id = ?"
  ).run(
    title ?? (existing as any).title,
    description ?? (existing as any).description,
    image ?? (existing as any).image,
    tech ? JSON.stringify(tech) : (existing as any).tech,
    link ?? (existing as any).link,
    id
  );

  const updated = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as any;
  res.json({ ...updated, tech: JSON.parse(updated.tech || "[]") });
});

// DELETE /api/projects/:id - Delete project
router.delete("/:id", requireAuth, (req, res) => {
  const { id } = req.params;

  const existing = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  if (!existing) {
    res.status(404).json({ error: "Proyecto no encontrado" });
    return;
  }

  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  res.json({ message: "Proyecto eliminado" });
});

export default router;
