import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { scrapeAndProcess } from "../services/jobScraper.js";
import { applyGreenhouse, isGreenhouse } from "../services/jobApplier.js";

const router = Router();

const STATUSES = ["nueva", "aplicada", "entrevista", "oferta", "rechazada"] as const;
type Status = typeof STATUSES[number];

// GET /api/jobs — listar todas (protegido)
router.get("/", requireAuth, (_req, res) => {
  const jobs = db.prepare(`
    SELECT id, title, company, url, location, salary, tech, status, notes, source, match_score, cover_letter, created_at, applied_at
    FROM job_offers ORDER BY match_score DESC, created_at DESC
  `).all();
  res.json(jobs);
});

// GET /api/jobs/stats — estadísticas del kanban (protegido)
router.get("/stats", requireAuth, (_req, res) => {
  const counts = db.prepare(`
    SELECT status, COUNT(*) as count FROM job_offers GROUP BY status
  `).all() as { status: string; count: number }[];

  const avgScore = db.prepare("SELECT AVG(match_score) as avg FROM job_offers").get() as { avg: number };
  const total = db.prepare("SELECT COUNT(*) as c FROM job_offers").get() as { c: number };

  res.json({ by_status: counts, avg_score: Math.round(avgScore.avg || 0), total: total.c });
});

// POST /api/jobs — crear oferta manual (protegido)
router.post("/", requireAuth, (req, res) => {
  const { title, company, url, location, salary, description, tech, status = "nueva", notes } = req.body;
  if (!title || !company) { res.status(400).json({ error: "title y company son obligatorios" }); return; }

  const result = db.prepare(`
    INSERT INTO job_offers (title, company, url, location, salary, description, tech, status, notes, source, match_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', 0)
  `).run(title, company, url || "", location || "", salary || "", description || "", JSON.stringify(tech || []), status, notes || "");

  res.status(201).json({ id: result.lastInsertRowid });
});

// PUT /api/jobs/:id — actualizar estado o notas (protegido)
router.put("/:id", requireAuth, (req, res) => {
  const { status, notes } = req.body;
  const id = Number(req.params.id);

  if (status && !STATUSES.includes(status as Status)) {
    res.status(400).json({ error: "Estado inválido" }); return;
  }

  const updates: string[] = [];
  const values: unknown[] = [];

  if (status !== undefined) {
    updates.push("status = ?");
    values.push(status);
    if (status === "aplicada") { updates.push("applied_at = ?"); values.push(new Date().toISOString()); }
  }
  if (notes !== undefined) { updates.push("notes = ?"); values.push(notes); }

  if (updates.length === 0) { res.status(400).json({ error: "Nada que actualizar" }); return; }

  values.push(id);
  db.prepare(`UPDATE job_offers SET ${updates.join(", ")} WHERE id = ?`).run(...values);
  res.json({ ok: true });
});

// DELETE /api/jobs/:id — eliminar oferta (protegido)
router.delete("/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM job_offers WHERE id = ?").run(Number(req.params.id));
  res.json({ ok: true });
});

// POST /api/jobs/:id/apply — aplicar vía Puppeteer a una oferta específica (protegido)
router.post("/:id/apply", requireAuth, async (req, res) => {
  const job = db.prepare("SELECT * FROM job_offers WHERE id = ?").get(Number(req.params.id)) as
    { url: string; cover_letter: string; title: string; company: string } | undefined;

  if (!job) { res.status(404).json({ error: "Oferta no encontrada" }); return; }
  if (!isGreenhouse(job.url)) { res.status(400).json({ error: "Solo soportado para Greenhouse de momento" }); return; }
  if (!job.cover_letter) { res.status(400).json({ error: "Genera primero la carta de presentación" }); return; }

  const result = await applyGreenhouse(job.url, job.cover_letter);

  if (result.success) {
    db.prepare("UPDATE job_offers SET status = 'aplicada', applied_at = ? WHERE id = ?")
      .run(new Date().toISOString(), Number(req.params.id));
  }

  res.json(result);
});

// POST /api/jobs/scrape — lanzar scraping manual (protegido)
router.post("/scrape", requireAuth, async (_req, res) => {
  try {
    const result = await scrapeAndProcess();
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error("[jobs/scrape]", err);
    res.status(500).json({ error: "Error en el scraping" });
  }
});

export default router;
