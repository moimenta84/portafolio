import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getGeoData, isPrivateIp } from "../utils/geo.js";

const router = Router();

// Anonimiza la IP: guarda solo los primeros 3 octetos (IPv4) para cumplir con RGPD
function anonymizeIp(ip: string): string {
  const ipv4 = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (ipv4) return `${ipv4[1]}.0`;
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + ":0:0:0:0";
  return ip;
}

// POST /api/visits - Registrar visita
router.post("/", async (req, res) => {
  const ip = req.clientIp || "";
  const { page, referrer } = req.body;

  let city = "", region = "", country = "", org = "", is_company = 0;
  let timezone = "", isp = "", as_number = "";

  if (!isPrivateIp(ip)) {
    const geo = await getGeoData(ip);
    if (geo) ({ city, region, country, org, is_company, timezone, isp, as_number } = geo);
  }

  const anonIp = anonymizeIp(ip);

  let cleanReferrer = "directo";
  try {
    if (referrer) {
      // UTM source enviado desde el frontend (p.ej. utm:linkedin)
      if (referrer.startsWith("utm:")) {
        cleanReferrer = referrer.slice(4);
      } else {
        cleanReferrer = new URL(referrer).hostname.replace(/^www\./, "");
      }
    }
  } catch {}

  db.prepare(`
    INSERT INTO visits (ip, page, city, region, country, org, is_company, timezone, isp, as_number, referrer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(anonIp, page || "/", city, region, country, org, is_company, timezone, isp, as_number, cleanReferrer);

  const total = db.prepare("SELECT COUNT(DISTINCT ip) as c FROM visits").get() as { c: number };
  res.json({ total_visits: total.c });
});

// POST /api/visits/duration - Actualizar duración de la última visita de esta IP
router.post("/duration", (req, res) => {
  const ip = anonymizeIp(req.clientIp || "");
  const { seconds } = req.body;
  if (!seconds || seconds < 2) { res.json({ ok: true }); return; }

  db.prepare(`
    UPDATE visits SET duration_seconds = ?
    WHERE id = (SELECT id FROM visits WHERE ip = ? ORDER BY created_at DESC LIMIT 1)
  `).run(Math.min(Math.round(seconds), 3600), ip);

  res.json({ ok: true });
});

// GET /api/visits/count
router.get("/count", (_req, res) => {
  const total = db.prepare("SELECT COUNT(DISTINCT ip) as c FROM visits").get() as { c: number };
  const pageViews = db.prepare("SELECT COUNT(*) as c FROM visits").get() as { c: number };
  res.json({ unique_visitors: total.c, total_page_views: pageViews.c });
});

// GET /api/visits/stats (admin)
router.get("/stats", requireAuth, (_req, res) => {
  const total = db.prepare(
    "SELECT COUNT(DISTINCT ip) as unique_visitors, COUNT(*) as total_page_views FROM visits"
  ).get() as { unique_visitors: number; total_page_views: number };

  const today = db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits WHERE created_at >= date('now')"
  ).get() as { c: number };

  const avgDuration = db.prepare(
    "SELECT ROUND(AVG(duration_seconds)) as avg FROM visits WHERE duration_seconds IS NOT NULL"
  ).get() as { avg: number | null };

  const byPage = db.prepare(`
    SELECT page, COUNT(*) as views, COUNT(DISTINCT ip) as unique_visitors
    FROM visits GROUP BY page ORDER BY views DESC
  `).all() as { page: string; views: number; unique_visitors: number }[];

  const byRegion = db.prepare(`
    SELECT region, COUNT(DISTINCT ip) as visitors
    FROM visits WHERE region IS NOT NULL AND region != ''
    GROUP BY region ORDER BY visitors DESC LIMIT 10
  `).all() as { region: string; visitors: number }[];

  const byReferrer = db.prepare(`
    SELECT referrer, COUNT(DISTINCT ip) as visitors
    FROM visits WHERE referrer IS NOT NULL AND referrer != ''
    GROUP BY referrer ORDER BY visitors DESC LIMIT 10
  `).all() as { referrer: string; visitors: number }[];

  const empresaCount = db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits WHERE is_company = 1"
  ).get() as { c: number };

  const usuarioCount = db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits WHERE is_company = 0"
  ).get() as { c: number };

  res.json({
    unique_visitors: total.unique_visitors,
    total_page_views: total.total_page_views,
    today_visitors: today.c,
    avg_duration_seconds: avgDuration.avg ?? 0,
    by_page: byPage,
    by_region: byRegion,
    by_referrer: byReferrer,
    empresa_visitors: empresaCount.c,
    usuario_visitors: usuarioCount.c,
  });
});

export default router;
