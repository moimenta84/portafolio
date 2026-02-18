import { Router, type Request, type Response } from "express";
import RssParser from "rss-parser";
import db from "../db/database.js";

const router = Router();
const parser = new RssParser({
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
  timeout: 8000,
});

interface NewsSource {
  id: string;
  name: string;
  url: string;
  category: string;
}

const SOURCES: NewsSource[] = [
  { id: "muycomputer", name: "MuyComputer", url: "https://www.muycomputer.com/feed/", category: "software" },
  { id: "hipertextual", name: "Hipertextual", url: "https://hipertextual.com/feed", category: "tecnología" },
  { id: "wwwhatsnew", name: "WWWhat's New", url: "https://wwwhatsnew.com/feed/", category: "desarrollo" },
  { id: "andro4all", name: "Andro4all", url: "https://andro4all.com/feed", category: "tecnología" },
  { id: "microsiervos", name: "Microsiervos", url: "https://www.microsiervos.com/index.xml", category: "tecnología" },
];

const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutos

// Crear tabla de caché
db.exec(`
  CREATE TABLE IF NOT EXISTS news_cache (
    source_id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    fetched_at INTEGER NOT NULL
  )
`);

function getCached(sourceId: string): any[] | null {
  const row = db.prepare("SELECT data, fetched_at FROM news_cache WHERE source_id = ?").get(sourceId) as any;
  if (!row) return null;
  if (Date.now() - row.fetched_at > CACHE_DURATION_MS) return null;
  return JSON.parse(row.data);
}

function setCache(sourceId: string, data: any[]) {
  db.prepare(
    "INSERT OR REPLACE INTO news_cache (source_id, data, fetched_at) VALUES (?, ?, ?)"
  ).run(sourceId, JSON.stringify(data), Date.now());
}

async function fetchSource(source: NewsSource) {
  const cached = getCached(source.id);
  if (cached) return cached;

  try {
    const feed = await parser.parseURL(source.url);
    const articles = feed.items.slice(0, 10).map((item) => ({
      id: item.guid || item.link || `${source.id}-${Date.now()}-${Math.random()}`,
      title: item.title || "",
      description: (item.contentSnippet || item.content || "").slice(0, 200).replace(/<[^>]*>/g, ""),
      url: item.link || "",
      image: extractImage(item),
      published_at: item.isoDate || item.pubDate || new Date().toISOString(),
      source: source.name,
      category: source.category,
    }));

    setCache(source.id, articles);
    return articles;
  } catch (err) {
    console.error(`Error fetching ${source.name}:`, (err as Error).message);
    const row = db.prepare("SELECT data FROM news_cache WHERE source_id = ?").get(source.id) as any;
    return row ? JSON.parse(row.data) : [];
  }
}

function extractImage(item: any): string | null {
  if (item.enclosure?.url) return item.enclosure.url;

  const content = item["content:encoded"] || item.content || "";
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];

  return null;
}

// GET /api/news
router.get("/", (req: Request, res: Response) => {
  Promise.all(SOURCES.map(fetchSource))
    .then((results) => {
      const all = results.flat();
      all.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

      res.json({
        articles: all,
        sources: SOURCES.map((s) => ({ id: s.id, name: s.name, category: s.category })),
      });
    })
    .catch(() => {
      res.status(500).json({ error: "Error al obtener noticias" });
    });
});

// GET /api/news/:sourceId
router.get("/:sourceId", (req: Request, res: Response) => {
  const source = SOURCES.find((s) => s.id === req.params.sourceId);
  if (!source) {
    res.status(404).json({ error: "Fuente no encontrada" });
    return;
  }

  fetchSource(source)
    .then((articles) => {
      res.json({ articles, source: { id: source.id, name: source.name } });
    })
    .catch(() => {
      res.status(500).json({ error: "Error al obtener noticias" });
    });
});

export default router;
