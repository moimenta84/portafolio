// sitemap.ts — Sitemap dinámico generado desde la BD.
// Se sirve en /sitemap.xml antes que los archivos estáticos,
// así siempre refleja el estado real de los proyectos.

import { Router } from "express";
import db from "../db/database.js";

const router = Router();

const BASE_URL = "https://ikermartinezdev.com";

const STATIC_PAGES = [
  { path: "/",           changefreq: "weekly",  priority: "1.0" },
  { path: "/about",      changefreq: "monthly", priority: "0.8" },
  { path: "/projects",   changefreq: "weekly",  priority: "0.9" },
  { path: "/newsletter", changefreq: "daily",   priority: "0.6" },
  { path: "/contact",    changefreq: "monthly", priority: "0.7" },
  { path: "/privacy",    changefreq: "yearly",  priority: "0.2" },
];

router.get("/sitemap.xml", (_req, res) => {
  const lastProject = db
    .prepare("SELECT created_at FROM projects ORDER BY created_at DESC LIMIT 1")
    .get() as { created_at: string } | undefined;

  const projectsLastmod = lastProject
    ? new Date(lastProject.created_at).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const today = new Date().toISOString().split("T")[0];

  const urls = STATIC_PAGES.map(({ path, changefreq, priority }) => {
    const lastmod = path === "/projects" ? projectsLastmod : today;
    return `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

export default router;
