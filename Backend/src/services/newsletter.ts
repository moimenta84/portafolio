import RssParser from "rss-parser";
import db from "../db/database.js";
import { sendEmail, welcomeEmailHtml } from "./notifications.js";

const parser = new RssParser({
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
  timeout: 8000,
});

const SOURCES = [
  { name: "MuyComputer",  url: "https://www.muycomputer.com/feed/" },
  { name: "Hipertextual", url: "https://hipertextual.com/feed" },
  { name: "WWWhat's New", url: "https://wwwhatsnew.com/feed/" },
  { name: "Andro4all",    url: "https://andro4all.com/feed" },
  { name: "Microsiervos", url: "https://www.microsiervos.com/index.xml" },
];

type Article = { title: string; url: string; source: string };

// Obtiene artículos frescos del RSS; si fallan todos, usa la caché de la BD
export async function fetchArticles(): Promise<Article[]> {
  const results = await Promise.allSettled(
    SOURCES.map(async (s) => {
      const feed = await parser.parseURL(s.url);
      return feed.items.slice(0, 3).map((item) => ({
        title: item.title || "",
        url:   item.link  || "",
        source: s.name,
      }));
    })
  );

  const articles = results
    .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((a) => a.title && a.url)
    .slice(0, 5);

  if (articles.length > 0) return articles;

  // Fallback: usar caché almacenada en BD
  const rows = db.prepare("SELECT data FROM news_cache LIMIT 5").all() as { data: string }[];
  return rows
    .flatMap((row) => { try { return JSON.parse(row.data); } catch { return []; } })
    .slice(0, 5)
    .map((a: any) => ({ title: a.title, url: a.url, source: a.source }));
}

// Envía el newsletter a todos los suscriptores
export async function dispatchToAll(): Promise<{ sent: number; errors: number; total: number }> {
  const subscribers = db
    .prepare("SELECT email, unsubscribe_token FROM subscribers")
    .all() as { email: string; unsubscribe_token: string }[];

  if (!subscribers.length) return { sent: 0, errors: 0, total: 0 };

  console.log(`[newsletter] Enviando a ${subscribers.length} suscriptores...`);
  const articles = await fetchArticles();

  let sent = 0, errors = 0;
  for (const sub of subscribers) {
    try {
      await sendEmail(
        sub.email,
        "📰 Últimas noticias — Iker Martínez Dev",
        welcomeEmailHtml(articles, sub.unsubscribe_token)
      );
      sent++;
    } catch { errors++; }
  }

  console.log(`[newsletter] Enviado: ${sent} ok, ${errors} errores`);
  db.prepare("INSERT INTO newsletter_sends (total, sent, errors) VALUES (?, ?, ?)").run(subscribers.length, sent, errors);
  return { sent, errors, total: subscribers.length };
}

// Envía el newsletter a un único suscriptor (al registrarse)
export async function dispatchToOne(email: string, unsubscribeToken: string): Promise<void> {
  const articles = await fetchArticles();
  await sendEmail(
    email,
    "🚀 ¡Bienvenido al newsletter de Iker Martínez Dev!",
    welcomeEmailHtml(articles, unsubscribeToken)
  );
}
