import db from "../db/database.js";

const KEYWORDS = ["spring boot", "java", "angular", "react", "typescript", "full stack", "fullstack", "backend", "junior"];
const AUTO_APPLY_THRESHOLD = 75;

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  candidate_required_location: string;
  salary: string;
  description: string;
  tags: string[];
  job_type: string;
  publication_date: string;
}

async function scoreWithGroq(title: string, company: string, description: string): Promise<{ score: number; reason: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { score: 50, reason: "Sin API key de Groq" };

  const prompt = `Eres un evaluador de ofertas de trabajo. Evalúa esta oferta para un estudiante de 2º DAW (Desarrollo de Aplicaciones Web) con estas habilidades: Spring Boot, Java, Angular, React, TypeScript, Docker, MySQL, IBM MQ. Busca posiciones junior/prácticas, backend o fullstack, remoto o España. IMPORTANTE: el candidato tiene certificado de discapacidad (≥33%), lo que le da acceso a cuotas de reserva en empresas españolas con +50 empleados. Si la oferta menciona discapacidad, cuota de reserva o "personas con discapacidad", suma 15 puntos extra al score.

Oferta:
- Título: ${title}
- Empresa: ${company}
- Descripción (extracto): ${description.slice(0, 600)}

Responde SOLO con JSON válido: {"score": 0-100, "reason": "razón en una frase corta"}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 100,
      }),
    });
    const data = await res.json() as { choices: { message: { content: string } }[] };
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw.match(/\{.*\}/s)?.[0] ?? "{}");
    return { score: Number(parsed.score) || 0, reason: String(parsed.reason || "") };
  } catch {
    return { score: 40, reason: "Error al puntuar" };
  }
}

async function generateCoverLetter(title: string, company: string, description: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return "";

  const prompt = `Escribe una carta de presentación breve (150 palabras máximo) en español para esta oferta. El candidato es Iker Martínez, estudiante de 2º DAW con experiencia en Spring Boot, Angular, React, Docker. Cuenta con certificado de discapacidad (≥33%), menciónalo si la oferta lo valora. Tono profesional pero cercano.

Oferta: ${title} en ${company}
Descripción: ${description.slice(0, 400)}

Escribe solo la carta, sin asunto ni firma.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    const data = await res.json() as { choices: { message: { content: string } }[] };
    return data.choices?.[0]?.message?.content ?? "";
  } catch {
    return "";
  }
}

async function notifyTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
  } catch {}
}

export async function scrapeAndProcess(): Promise<{ scraped: number; new_offers: number; auto_applied: number }> {
  console.log("[jobs] Iniciando scraping de Remotive...");

  // Fetch Remotive (software-dev category, sin auth necesaria)
  const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=100");
  if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);
  const data = await res.json() as { jobs: RemotiveJob[] };
  const jobs: RemotiveJob[] = data.jobs ?? [];

  // Filtrar por keywords relevantes
  const relevant = jobs.filter(j => {
    const text = `${j.title} ${j.tags.join(" ")}`.toLowerCase();
    return KEYWORDS.some(kw => text.includes(kw));
  });

  const existingUrls = new Set(
    (db.prepare("SELECT url FROM job_offers").all() as { url: string }[]).map(r => r.url)
  );

  let new_offers = 0;
  let auto_applied = 0;

  const insert = db.prepare(`
    INSERT INTO job_offers (title, company, url, location, salary, description, tech, status, source, match_score, cover_letter, applied_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const job of relevant) {
    if (existingUrls.has(job.url)) continue;

    const { score, reason } = await scoreWithGroq(job.title, job.company_name, job.description);
    const tech = JSON.stringify(job.tags.slice(0, 6));
    const status = score >= AUTO_APPLY_THRESHOLD ? "aplicada" : "nueva";
    let coverLetter = "";
    let appliedAt: string | null = null;

    if (score >= AUTO_APPLY_THRESHOLD) {
      coverLetter = await generateCoverLetter(job.title, job.company_name, job.description);
      appliedAt = new Date().toISOString();
      auto_applied++;

      await notifyTelegram(
        `💼 <b>Auto-aplicado</b>\n` +
        `<b>${job.title}</b> en ${job.company_name}\n` +
        `📍 ${job.candidate_required_location || "Remote"}\n` +
        `🎯 Score: ${score}% — ${reason}\n` +
        `🔗 ${job.url}`
      );
    }

    insert.run(
      job.title,
      job.company_name,
      job.url,
      job.candidate_required_location || "Remote",
      job.salary || "",
      job.description.slice(0, 2000),
      tech,
      status,
      "remotive",
      score,
      coverLetter,
      appliedAt
    );
    new_offers++;
  }

  console.log(`[jobs] Scraping completo: ${relevant.length} relevantes, ${new_offers} nuevas, ${auto_applied} auto-aplicadas`);

  if (new_offers > 0) {
    await notifyTelegram(
      `📊 <b>Resumen scraping diario</b>\n` +
      `Ofertas revisadas: ${relevant.length}\n` +
      `Nuevas añadidas: ${new_offers}\n` +
      `Auto-aplicadas (score ≥${AUTO_APPLY_THRESHOLD}%): ${auto_applied}`
    );
  }

  return { scraped: relevant.length, new_offers, auto_applied };
}
