import db from "../db/database.js";
import nodemailer from "nodemailer";
import * as cheerio from "cheerio";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CV_PATH = process.env.CV_PATH ?? "/var/www/html/Pdf/curriculumIkerMartinez.pdf";

const AUTO_APPLY_THRESHOLD = 75;
const KEYWORDS = ["spring boot", "java", "angular", "react", "typescript", "full stack", "fullstack", "backend", "junior", "desarrollador"];
const DISABILITY_KEYWORDS = ["discapacidad", "diversidad funcional", "disability", "certificado de discapacidad", "cuota de reserva", "once"];

// ─── Nodemailer ───────────────────────────────────────────────────────────────

function getMailer() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: "moimenta267@gmail.com", pass: process.env.GMAIL_APP_PASSWORD },
  });
}

// ─── Groq helpers ─────────────────────────────────────────────────────────────

async function groqChat(prompt: string, maxTokens = 150): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return "";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: maxTokens,
    }),
  });
  const data = await res.json() as { choices?: { message: { content: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

async function scoreJob(title: string, company: string, desc: string, isDisability: boolean): Promise<{ score: number; reason: string }> {
  const disabilityNote = isDisability
    ? "IMPORTANTE: Esta oferta es específica para personas con certificado de discapacidad. El candidato tiene certificado ≥33%, suma 20 puntos extra automáticamente."
    : "El candidato tiene certificado de discapacidad ≥33%. Si la oferta menciona discapacidad o cuota de reserva, suma 15 puntos extra.";

  const raw = await groqChat(
    `Evalúa esta oferta para Iker Martínez, estudiante de 2º DAW (España). Skills: Spring Boot, Java, Angular, React, TypeScript, Docker, MySQL, IBM MQ. Busca posiciones junior/prácticas, backend o fullstack, remoto o España. ${disabilityNote}

Oferta: "${title}" en ${company}
Descripción: ${desc.slice(0, 500)}

Responde SOLO JSON: {"score": 0-100, "reason": "frase corta"}`, 120
  );
  try {
    const parsed = JSON.parse(raw.match(/\{.*\}/s)?.[0] ?? "{}");
    return { score: Math.min(100, Number(parsed.score) || 0), reason: String(parsed.reason || "") };
  } catch {
    return { score: 40, reason: "Error al puntuar" };
  }
}

async function generateCoverLetter(title: string, company: string, desc: string, isDisability: boolean): Promise<string> {
  const disNote = isDisability
    ? "Menciona explícitamente que el candidato tiene certificado de discapacidad ≥33% y está interesado en la cuota de reserva."
    : "";
  return groqChat(
    `Escribe una carta de presentación breve (150 palabras) en español para Iker Martínez, estudiante de 2º DAW, skills: Spring Boot, Angular, React, Docker. Tono profesional y cercano. ${disNote}

Puesto: ${title} en ${company}
Descripción: ${desc.slice(0, 400)}

Solo la carta, sin asunto ni despedida formal.`, 400
  );
}

// ─── Email auto-apply ─────────────────────────────────────────────────────────

function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match?.[0] ?? null;
}

async function applyByEmail(to: string, jobTitle: string, company: string, coverLetter: string): Promise<boolean> {
  if (!process.env.GMAIL_APP_PASSWORD) return false;
  try {
    const mailer = getMailer();
    const fs = await import("fs");
    const attachments = fs.existsSync(CV_PATH)
      ? [{ filename: "CV_IkerMartinez.pdf", path: CV_PATH }]
      : [];

    await mailer.sendMail({
      from: '"Iker Martínez" <moimenta267@gmail.com>',
      to,
      subject: `Candidatura: ${jobTitle} — Iker Martínez Velasco`,
      text: coverLetter + "\n\nAdjunto mi CV para su consideración.\n\nUn saludo,\nIker Martínez\nikermartinezdev.com",
      attachments,
    });
    return true;
  } catch (err) {
    console.error("[jobs] Error enviando email:", err);
    return false;
  }
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

async function notify(msg: string) {
  const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_CHAT_ID: chatId } = process.env;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: "HTML" }),
    });
  } catch {}
}

// ─── DB insert ───────────────────────────────────────────────────────────────

const insertJob = db.prepare(`
  INSERT OR IGNORE INTO job_offers
    (title, company, url, location, salary, description, tech, status, source, match_score, cover_letter, applied_at, is_disability)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function saveJob(params: {
  title: string; company: string; url: string; location: string; salary: string;
  description: string; tech: string[]; status: string; source: string;
  score: number; coverLetter: string; appliedAt: string | null; isDisability: boolean;
}) {
  insertJob.run(
    params.title, params.company, params.url, params.location, params.salary,
    params.description.slice(0, 2000), JSON.stringify(params.tech),
    params.status, params.source, params.score, params.coverLetter,
    params.appliedAt, params.isDisability ? 1 : 0
  );
}

// ─── Remotive scraper ─────────────────────────────────────────────────────────

interface RemotiveJob {
  id: number; url: string; title: string; company_name: string;
  candidate_required_location: string; salary: string;
  description: string; tags: string[];
}

async function scrapeRemotive(): Promise<number> {
  const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=100", {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) return 0;
  const data = await res.json() as { jobs: RemotiveJob[] };
  const jobs = data.jobs ?? [];

  const existing = new Set((db.prepare("SELECT url FROM job_offers").all() as { url: string }[]).map(r => r.url));
  let added = 0;

  for (const job of jobs) {
    const text = `${job.title} ${job.tags.join(" ")}`.toLowerCase();
    if (!KEYWORDS.some(kw => text.includes(kw))) continue;
    if (existing.has(job.url)) continue;

    const isDisability = DISABILITY_KEYWORDS.some(kw => job.description.toLowerCase().includes(kw));
    const { score, reason } = await scoreJob(job.title, job.company_name, job.description, isDisability);

    let coverLetter = "";
    let appliedAt: string | null = null;
    let status = score >= AUTO_APPLY_THRESHOLD ? "aplicada" : "nueva";
    let applied = false;

    if (score >= AUTO_APPLY_THRESHOLD) {
      coverLetter = await generateCoverLetter(job.title, job.company_name, job.description, isDisability);
      appliedAt = new Date().toISOString();

      // Intentar apply por email si hay contacto en la descripción
      const contactEmail = extractEmail(job.description);
      if (contactEmail) {
        applied = await applyByEmail(contactEmail, job.title, job.company_name, coverLetter);
        if (applied) {
          await notify(`📧 <b>Email enviado</b>\n<b>${job.title}</b> en ${job.company_name}\n📩 ${contactEmail}\n🎯 Score: ${score}% — ${reason}`);
        }
      }

      if (!applied) {
        status = "pre-aplicada"; // Carta lista, pendiente de envío manual
        await notify(`💼 <b>Alta prioridad — postular manualmente</b>\n<b>${job.title}</b> en ${job.company_name}\n📍 ${job.candidate_required_location || "Remote"}\n🎯 Score: ${score}% — ${reason}\n🔗 ${job.url}`);
      }
    }

    saveJob({
      title: job.title, company: job.company_name, url: job.url,
      location: job.candidate_required_location || "Remote", salary: job.salary || "",
      description: job.description, tech: job.tags.slice(0, 6),
      status, source: "remotive", score, coverLetter, appliedAt, isDisability,
    });
    added++;
  }
  return added;
}

// ─── Tecnoempleo discapacidad scraper ────────────────────────────────────────

interface TecnoJob { title: string; company: string; url: string; location: string; description: string }

async function scrapeTecnoempleo(): Promise<number> {
  const urls = [
    "https://www.tecnoempleo.com/ofertas-trabajo/?discapacidad=1",
    "https://www.tecnoempleo.com/buscar-trabajo/?discapacidad=1&te=spring+boot",
    "https://www.tecnoempleo.com/buscar-trabajo/?discapacidad=1&te=java",
  ];

  const existing = new Set((db.prepare("SELECT url FROM job_offers").all() as { url: string }[]).map(r => r.url));
  let added = 0;

  for (const pageUrl of urls) {
    try {
      const res = await fetch(pageUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } });
      if (!res.ok) continue;
      const html = await res.text();
      const $ = cheerio.load(html);

      const found: TecnoJob[] = [];
      $("div.p-3.border, article, .oferta, [class*='oferta']").each((_, el) => {
        const titleEl = $(el).find("h2 a, h3 a, .titulo a, a[href*='/oferta-trabajo/']").first();
        const title = titleEl.text().trim();
        const href = titleEl.attr("href") || "";
        if (!title || !href) return;

        const url = href.startsWith("http") ? href : `https://www.tecnoempleo.com${href}`;
        const company = $(el).find(".empresa, [class*='empresa'], .company").first().text().trim() || "Empresa";
        const location = $(el).find(".location, [class*='location'], .provincia").first().text().trim() || "España";
        const description = $(el).find("p, .descripcion, [class*='desc']").first().text().trim() || "";

        found.push({ title, company, url, location, description });
      });

      for (const job of found) {
        if (existing.has(job.url)) continue;

        const { score, reason } = await scoreJob(job.title, job.company, job.description, true);
        let coverLetter = "";
        let appliedAt: string | null = null;
        let status = score >= AUTO_APPLY_THRESHOLD ? "pre-aplicada" : "nueva";

        if (score >= AUTO_APPLY_THRESHOLD) {
          coverLetter = await generateCoverLetter(job.title, job.company, job.description, true);
          appliedAt = new Date().toISOString();
          await notify(
            `♿ <b>Oferta discapacidad — postular</b>\n<b>${job.title}</b> en ${job.company}\n📍 ${job.location}\n🎯 Score: ${score}% — ${reason}\n🔗 ${job.url}`
          );
        }

        saveJob({
          title: job.title, company: job.company, url: job.url,
          location: job.location, salary: "", description: job.description,
          tech: [], status, source: "tecnoempleo-discapacidad",
          score, coverLetter, appliedAt, isDisability: true,
        });
        added++;
        existing.add(job.url);
      }
    } catch (err) {
      console.error(`[jobs] Error scraping ${pageUrl}:`, err);
    }
  }
  return added;
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function scrapeAndProcess(): Promise<{ scraped_remotive: number; scraped_disability: number; auto_applied: number }> {
  console.log("[jobs] Iniciando scraping...");

  const [remotiveAdded, disabilityAdded] = await Promise.all([
    scrapeRemotive(),
    scrapeTecnoempleo(),
  ]);

  const autoApplied = (db.prepare(
    "SELECT COUNT(*) as c FROM job_offers WHERE status = 'aplicada' AND DATE(applied_at) = DATE('now')"
  ).get() as { c: number }).c;

  const summary = `📊 <b>Resumen scraping</b>\nRemotive: ${remotiveAdded} nuevas\nTecnoempleo discapacidad: ${disabilityAdded} nuevas\nAuto-aplicadas hoy: ${autoApplied}`;
  if (remotiveAdded + disabilityAdded > 0) await notify(summary);

  console.log(`[jobs] Completado — Remotive: ${remotiveAdded}, Discapacidad: ${disabilityAdded}`);
  return { scraped_remotive: remotiveAdded, scraped_disability: disabilityAdded, auto_applied: autoApplied };
}
