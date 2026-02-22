import nodemailer from "nodemailer";

// ── Email ──────────────────────────────────────────────────────────────────

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "moimenta267@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.GMAIL_APP_PASSWORD) {
    console.warn("GMAIL_APP_PASSWORD no configurado, email no enviado");
    return;
  }
  try {
    await getTransporter().sendMail({
      from: '"Iker Martínez Dev" <moimenta267@gmail.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Error enviando email:", err);
  }
}

// ── Telegram ───────────────────────────────────────────────────────────────

export async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Telegram no configurado, mensaje no enviado");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("Error enviando Telegram:", err);
  }
}

// ── Templates ──────────────────────────────────────────────────────────────

export function contactEmailHtml(name: string, email: string, subject: string, message: string) {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
      <h2 style="color:#22d3ee;margin-bottom:24px">📩 Nuevo mensaje de contacto</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#94a3b8;width:100px">De</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#94a3b8">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#22d3ee">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#94a3b8">Asunto</td><td style="padding:8px 0">${subject}</td></tr>
      </table>
      <div style="margin-top:20px;padding:16px;background:#1e293b;border-radius:8px;border-left:3px solid #22d3ee">
        <p style="margin:0;line-height:1.6">${message.replace(/\n/g, "<br>")}</p>
      </div>
      <p style="margin-top:20px;color:#475569;font-size:12px">Recibido desde ikermartinezdev.com</p>
    </div>
  `;
}

export function welcomeEmailHtml(articles: { title: string; url: string; source: string }[], unsubscribeToken?: string) {
  const articlesHtml = articles.slice(0, 5).map(a => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1e293b">
        <a href="${a.url}" style="color:#22d3ee;font-weight:600;text-decoration:none">${a.title}</a>
        <span style="display:block;color:#64748b;font-size:12px;margin-top:2px">${a.source}</span>
      </td>
    </tr>
  `).join("");

  const unsubscribeLink = unsubscribeToken
    ? `<a href="https://ikermartinezdev.com/api/subscribers/unsubscribe?token=${unsubscribeToken}" style="color:#475569">Cancelar suscripción</a>`
    : "";

  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
      <h2 style="color:#22d3ee;margin-bottom:8px">🚀 ¡Bienvenido al newsletter!</h2>
      <p style="color:#94a3b8;margin-bottom:24px">Recibirás las últimas noticias de tecnología y desarrollo web. Aquí van las más recientes:</p>
      <table style="width:100%;border-collapse:collapse">${articlesHtml}</table>
      <p style="margin-top:24px;color:#475569;font-size:12px">
        Suscrito desde <a href="https://ikermartinezdev.com" style="color:#22d3ee">ikermartinezdev.com</a>
        ${unsubscribeLink ? ` · ${unsubscribeLink}` : ""}
      </p>
    </div>
  `;
}

export function followWelcomeEmailHtml(unsubscribeToken: string) {
  const unsubscribeLink = `https://ikermartinezdev.com/api/subscribers/unsubscribe?token=${unsubscribeToken}`;
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px">
      <h2 style="color:#22d3ee;margin-bottom:8px">👋 ¡Gracias por seguirme!</h2>
      <p style="color:#94a3b8;margin-bottom:16px">
        A partir de ahora te avisaré cuando publique nuevos proyectos, mejoras en el portafolio o novedades relevantes de mi carrera como desarrollador.
      </p>
      <p style="color:#94a3b8;margin-bottom:24px">
        Mientras tanto puedes echarle un vistazo a lo que ya he construido:
      </p>
      <a href="https://ikermartinezdev.com/projects"
         style="display:inline-block;padding:10px 24px;background:#22d3ee;color:#0f172a;border-radius:8px;text-decoration:none;font-weight:700">
        Ver proyectos
      </a>
      <p style="margin-top:32px;color:#475569;font-size:12px">
        Recibido desde <a href="https://ikermartinezdev.com" style="color:#22d3ee">ikermartinezdev.com</a>
        · <a href="${unsubscribeLink}" style="color:#475569">Cancelar suscripción</a>
      </p>
    </div>
  `;
}
