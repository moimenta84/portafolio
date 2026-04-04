import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getGeoData, isPrivateIp } from "../utils/geo.js";

const router = Router();

function detectDevice(ua: string): "mobile" | "tablet" | "desktop" {
  const u = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/.test(u)) return "tablet";
  if (/mobile|android|iphone|ipod|blackberry|windows phone/.test(u)) return "mobile";
  return "desktop";
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\//i.test(ua)) return "Opera";
  if (/chrome/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua)) return "Safari";
  return "Otro";
}

function detectOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad/i.test(ua)) return "iOS";
  if (/mac os/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Otro";
}

function anonymizeIp(ip: string): string {
  const ipv4 = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (ipv4) return `${ipv4[1]}.0`;
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + ":0:0:0:0";
  return ip;
}

// POST /api/visits
router.post("/", async (req, res) => {
  const ip = req.clientIp || "";
  const { page, referrer } = req.body;
  const ua = req.headers["user-agent"] || "";
  const device = detectDevice(ua);
  const browser = detectBrowser(ua);
  const os = detectOS(ua);

  let city = "", region = "", country = "", org = "", is_company = 0;
  let timezone = "", isp = "", as_number = "";

  if (!isPrivateIp(ip)) {
    const geo = await getGeoData(ip);
    if (geo) ({ city, region, country, org, is_company, timezone, isp, as_number } = geo);
  }

  const anonIp = anonymizeIp(ip);

  // New vs returning
  const existing = db.prepare("SELECT id FROM visits WHERE ip = ?").get(anonIp);
  const is_new = existing ? 0 : 1;

  let cleanReferrer = "directo";
  try {
    if (referrer) {
      if (referrer.startsWith("utm:")) {
        cleanReferrer = referrer.slice(4);
      } else {
        cleanReferrer = new URL(referrer).hostname.replace(/^www\./, "");
      }
    }
  } catch {}

  db.prepare(`
    INSERT INTO visits (ip, page, city, region, country, org, is_company, timezone, isp, as_number, referrer, device, browser, os, is_new)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(anonIp, page || "/", city, region, country, org, is_company, timezone, isp, as_number, cleanReferrer, device, browser, os, is_new);

  // Guardar IP completa en ip_log (se borra automáticamente después de 30 días)
  if (!isPrivateIp(ip)) {
    db.prepare(`
      INSERT INTO ip_log (ip, city, region, country, org, isp, browser, os, device, page)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(ip, city, region, country, org, isp, browser, os, device, page || "/");

    // Limpiar entradas de más de 30 días
    db.prepare("DELETE FROM ip_log WHERE created_at < datetime('now', '-30 days')").run();
  }

  const total = db.prepare("SELECT COUNT(DISTINCT ip) as c FROM visits").get() as { c: number };
  res.json({ total_visits: total.c });
});

// POST /api/visits/duration
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

  const byDevice = db.prepare(`
    SELECT COALESCE(device, 'desktop') as device, COUNT(DISTINCT ip) as visitors
    FROM visits GROUP BY COALESCE(device, 'desktop') ORDER BY visitors DESC
  `).all() as { device: string; visitors: number }[];

  const byBrowser = db.prepare(`
    SELECT COALESCE(browser, 'Otro') as browser, COUNT(DISTINCT ip) as visitors
    FROM visits WHERE browser IS NOT NULL
    GROUP BY browser ORDER BY visitors DESC
  `).all() as { browser: string; visitors: number }[];

  const byOS = db.prepare(`
    SELECT COALESCE(os, 'Otro') as os, COUNT(DISTINCT ip) as visitors
    FROM visits WHERE os IS NOT NULL
    GROUP BY os ORDER BY visitors DESC
  `).all() as { os: string; visitors: number }[];

  const newVsReturning = db.prepare(`
    SELECT
      SUM(CASE WHEN is_new = 1 THEN 1 ELSE 0 END) as new_visitors,
      SUM(CASE WHEN is_new = 0 THEN 1 ELSE 0 END) as returning_visitors
    FROM (SELECT ip, MIN(is_new) as is_new FROM visits GROUP BY ip)
  `).get() as { new_visitors: number; returning_visitors: number };

  res.json({
    unique_visitors: total.unique_visitors,
    total_page_views: total.total_page_views,
    today_visitors: today.c,
    avg_duration_seconds: avgDuration.avg ?? 0,
    by_page: byPage,
    by_region: byRegion,
    by_referrer: byReferrer,
    by_device: byDevice,
    by_browser: byBrowser,
    by_os: byOS,
    empresa_visitors: empresaCount.c,
    usuario_visitors: usuarioCount.c,
    new_visitors: newVsReturning.new_visitors ?? 0,
    returning_visitors: newVsReturning.returning_visitors ?? 0,
  });
});

// GET /api/visits/history (admin)
router.get("/history", requireAuth, (_req, res) => {
  const rows = db.prepare(`
    SELECT date(created_at) as date, COUNT(DISTINCT ip) as visitors
    FROM visits WHERE created_at >= date('now', '-29 days')
    GROUP BY date(created_at) ORDER BY date ASC
  `).all() as { date: string; visitors: number }[];

  const result = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const found = rows.find((r) => r.date === dateStr);
    result.push({ date: dateStr, visitors: found?.visitors ?? 0 });
  }

  res.json(result);
});

// GET /api/visits/ip-log (admin)
router.get("/ip-log", requireAuth, (_req, res) => {
  const rows = db.prepare(`
    SELECT id, ip, city, region, country, org, isp, browser, os, device, page, created_at
    FROM ip_log
    ORDER BY created_at DESC
    LIMIT 200
  `).all();
  res.json(rows);
});

export default router;
