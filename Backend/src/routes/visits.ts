import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const RESIDENTIAL_ISPS = [
  "telefonica", "movistar", "orange", "vodafone", "masmovil",
  "yoigo", "jazztel", "digi", "lowi", "euskaltel", "telecable", "r cable",
];

function isPrivateIp(ip: string): boolean {
  return /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)
    || ip === "::1" || ip === "" || ip === "unknown";
}

async function getGeoData(ip: string) {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,regionName,city,country,org,hosting,timezone,isp,as`
    );
    const geo = await res.json() as {
      status: string; regionName?: string; city?: string; country?: string;
      org?: string; hosting?: boolean; timezone?: string; isp?: string; as?: string;
    };
    if (geo.status !== "success") return null;

    const org = geo.org || "";
    const orgLower = org.toLowerCase();
    const isResidential = RESIDENTIAL_ISPS.some((k) => orgLower.includes(k));
    const is_company = geo.hosting || !isResidential ? 1 : 0;

    return {
      city: geo.city || "",
      region: geo.regionName || "",
      country: geo.country || "",
      org,
      is_company,
      timezone: geo.timezone || "",
      isp: geo.isp || "",
      as_number: geo.as || "",
    };
  } catch {
    return null;
  }
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

  const cleanReferrer = referrer
    ? new URL(referrer).hostname.replace(/^www\./, "")
    : "directo";

  db.prepare(`
    INSERT INTO visits (ip, page, city, region, country, org, is_company, timezone, isp, as_number, referrer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(ip, page || "/", city, region, country, org, is_company, timezone, isp, as_number, cleanReferrer);

  const total = db.prepare("SELECT COUNT(DISTINCT ip) as c FROM visits").get() as { c: number };
  res.json({ total_visits: total.c });
});

// POST /api/visits/duration - Actualizar duración de la última visita de esta IP
router.post("/duration", (req, res) => {
  const ip = req.clientIp || "";
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
