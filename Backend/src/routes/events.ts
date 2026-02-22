import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// POST /api/events — registrar un evento de conversión (público)
router.post("/", (req, res) => {
  const { type, metadata } = req.body ?? {};
  const allowed = ["contact_submit", "project_click"];
  if (!type || !allowed.includes(type)) {
    res.status(400).json({ error: "Tipo de evento no válido" });
    return;
  }

  const ip = req.clientIp || "";
  db.prepare("INSERT INTO events (type, ip, metadata) VALUES (?, ?, ?)").run(
    type,
    ip,
    metadata ? JSON.stringify(metadata) : null
  );

  res.json({ ok: true });
});

// GET /api/events/stats — estadísticas de conversión (admin)
router.get("/stats", requireAuth, (_req, res) => {
  // Helpers para contar por ventana temporal
  const countEvents = (type: string, since: string, until?: string) => {
    if (until) {
      return (db.prepare(
        "SELECT COUNT(*) as c FROM events WHERE type = ? AND created_at >= ? AND created_at < ?"
      ).get(type, since, until) as { c: number }).c;
    }
    return (db.prepare(
      "SELECT COUNT(*) as c FROM events WHERE type = ? AND created_at >= ?"
    ).get(type, since) as { c: number }).c;
  };

  const countTable = (table: string, col: string, since: string, until?: string) => {
    if (until) {
      return (db.prepare(
        `SELECT COUNT(DISTINCT ${col}) as c FROM ${table} WHERE created_at >= ? AND created_at < ?`
      ).get(since, until) as { c: number }).c;
    }
    return (db.prepare(
      `SELECT COUNT(DISTINCT ${col}) as c FROM ${table} WHERE created_at >= ?`
    ).get(since) as { c: number }).c;
  };

  const THIS_WEEK = "datetime('now', '-7 days')";
  const LAST_WEEK_START = "datetime('now', '-14 days')";
  const LAST_WEEK_END = "datetime('now', '-7 days')";

  // Totales all-time
  const totalVisitors   = (db.prepare("SELECT COUNT(DISTINCT ip) as c FROM visits").get() as { c: number }).c;
  const totalCv         = (db.prepare("SELECT COUNT(*) as c FROM cv_downloads").get() as { c: number }).c;
  const totalClicks     = (db.prepare("SELECT COUNT(*) as c FROM events WHERE type = 'project_click'").get() as { c: number }).c;
  const totalContacts   = (db.prepare("SELECT COUNT(*) as c FROM events WHERE type = 'contact_submit'").get() as { c: number }).c;
  const totalFollows    = (db.prepare("SELECT COUNT(*) as c FROM followers").get() as { c: number }).c;

  // Esta semana
  const tw = {
    visitors:        (db.prepare(`SELECT COUNT(DISTINCT ip) as c FROM visits WHERE created_at >= ${THIS_WEEK}`).get() as { c: number }).c,
    cv_downloads:    (db.prepare(`SELECT COUNT(*) as c FROM cv_downloads WHERE created_at >= ${THIS_WEEK}`).get() as { c: number }).c,
    project_clicks:  (db.prepare(`SELECT COUNT(*) as c FROM events WHERE type = 'project_click' AND created_at >= ${THIS_WEEK}`).get() as { c: number }).c,
    contact_submits: (db.prepare(`SELECT COUNT(*) as c FROM events WHERE type = 'contact_submit' AND created_at >= ${THIS_WEEK}`).get() as { c: number }).c,
    follows:         (db.prepare(`SELECT COUNT(*) as c FROM followers WHERE created_at >= ${THIS_WEEK}`).get() as { c: number }).c,
  };

  // Semana pasada
  const lw = {
    visitors:        (db.prepare(`SELECT COUNT(DISTINCT ip) as c FROM visits WHERE created_at >= ${LAST_WEEK_START} AND created_at < ${LAST_WEEK_END}`).get() as { c: number }).c,
    cv_downloads:    (db.prepare(`SELECT COUNT(*) as c FROM cv_downloads WHERE created_at >= ${LAST_WEEK_START} AND created_at < ${LAST_WEEK_END}`).get() as { c: number }).c,
    project_clicks:  (db.prepare(`SELECT COUNT(*) as c FROM events WHERE type = 'project_click' AND created_at >= ${LAST_WEEK_START} AND created_at < ${LAST_WEEK_END}`).get() as { c: number }).c,
    contact_submits: (db.prepare(`SELECT COUNT(*) as c FROM events WHERE type = 'contact_submit' AND created_at >= ${LAST_WEEK_START} AND created_at < ${LAST_WEEK_END}`).get() as { c: number }).c,
    follows:         (db.prepare(`SELECT COUNT(*) as c FROM followers WHERE created_at >= ${LAST_WEEK_START} AND created_at < ${LAST_WEEK_END}`).get() as { c: number }).c,
  };

  // Top proyectos clicados
  const topProjects = db.prepare(`
    SELECT metadata, COUNT(*) as clicks
    FROM events WHERE type = 'project_click' AND metadata IS NOT NULL
    GROUP BY metadata ORDER BY clicks DESC LIMIT 5
  `).all() as { metadata: string; clicks: number }[];

  res.json({
    funnel: {
      total_visitors:   totalVisitors,
      cv_downloads:     totalCv,
      project_clicks:   totalClicks,
      contact_submits:  totalContacts,
      follows:          totalFollows,
    },
    this_week: tw,
    last_week: lw,
    top_projects: topProjects.map((r) => {
      try { return { ...JSON.parse(r.metadata), clicks: r.clicks }; }
      catch { return { title: "Desconocido", clicks: r.clicks }; }
    }),
  });
});

// GET /api/events/void - suprime favicon 404 en algunos navegadores
router.get("/void", (_req, res) => res.json({ ok: true }));

export default router;
