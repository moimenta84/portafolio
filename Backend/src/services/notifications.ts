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

const BASE_URL = "https://ikermartinezdev.com";

function emailWrapper(content: string, unsubscribeToken?: string) {
  const footer = unsubscribeToken
    ? `<a href="${BASE_URL}/api/subscribers/unsubscribe?token=${unsubscribeToken}" style="color:#475569;text-decoration:none;font-size:11px">Cancelar suscripción</a>`
    : "";
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060d1f;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060d1f;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- HEADER -->
        <tr>
          <td style="padding:0 0 24px 0">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#0f172a;border:1px solid #1e293b;border-radius:12px 12px 0 0;padding:20px 28px">
                  <span style="font-family:ui-monospace,monospace;font-size:18px;font-weight:700;color:#ffffff">
                    <span style="color:#22d3ee">&lt;</span>iker.martinez<span style="color:#22d3ee"> /&gt;</span>
                  </span>
                </td>
              </tr>
              <tr>
                <td style="height:2px;background:linear-gradient(90deg,#22d3ee,#0891b2,transparent)"></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="background:#0f172a;border:1px solid #1e293b;border-top:none;border-radius:0 0 12px 12px;padding:28px">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:20px 0 0 0;text-align:center">
            <p style="margin:0;color:#334155;font-size:11px;line-height:1.8">
              <a href="${BASE_URL}" style="color:#475569;text-decoration:none">ikermartinezdev.com</a>
              ${footer ? ` &nbsp;·&nbsp; ${footer}` : ""}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function contactEmailHtml(name: string, email: string, subject: string, message: string) {
  return emailWrapper(`
    <p style="margin:0 0 4px 0;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#22d3ee">Nuevo mensaje</p>
    <h2 style="margin:0 0 24px 0;font-size:22px;font-weight:700;color:#f1f5f9">📩 ${subject}</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e293b;border-radius:8px;overflow:hidden;margin-bottom:20px">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #0f172a;color:#64748b;font-size:13px;width:80px">De</td>
        <td style="padding:12px 16px;border-bottom:1px solid #0f172a;color:#f1f5f9;font-size:13px;font-weight:600">${name}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #0f172a;color:#64748b;font-size:13px">Email</td>
        <td style="padding:12px 16px;border-bottom:1px solid #0f172a;font-size:13px">
          <a href="mailto:${email}" style="color:#22d3ee;text-decoration:none">${email}</a>
        </td>
      </tr>
    </table>

    <div style="background:#1e293b;border-left:3px solid #22d3ee;border-radius:0 8px 8px 0;padding:16px 20px">
      <p style="margin:0;color:#cbd5e1;font-size:14px;line-height:1.7">${message.replace(/\n/g, "<br>")}</p>
    </div>
  `);
}

export function welcomeEmailHtml(articles: { title: string; url: string; source: string }[], unsubscribeToken?: string, trackingPixelUrl?: string) {
  const articlesHtml = articles.slice(0, 5).map((a, i) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #1e293b">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:28px;vertical-align:top;padding-top:2px">
              <span style="display:inline-block;width:22px;height:22px;background:#1e293b;border-radius:6px;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:#22d3ee">${i + 1}</span>
            </td>
            <td style="padding-left:10px">
              <a href="${a.url}" style="color:#f1f5f9;font-size:14px;font-weight:600;text-decoration:none;line-height:1.4;display:block">${a.title}</a>
              <span style="color:#475569;font-size:12px;margin-top:3px;display:block">${a.source}</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");

  return emailWrapper(`
    <!-- PERFIL -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #1e293b">
      <tr>
        <td style="width:56px;vertical-align:middle">
          <img src="${BASE_URL}/img/1760052219751.jpg"
               alt="Iker Martínez"
               width="48" height="48"
               style="display:block;width:48px;height:48px;object-fit:cover;border-radius:8px;border:2px solid #1e3a4a" />
        </td>
        <td style="padding-left:12px;vertical-align:middle">
          <p style="margin:0;font-size:14px;font-weight:700;color:#f1f5f9">Iker Martínez</p>
          <p style="margin:0;font-size:12px;color:#475569">Newsletter semanal de tech</p>
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:700;color:#f1f5f9">📰 Últimas noticias de tech</h2>
    <p style="margin:0 0 22px 0;color:#64748b;font-size:13px;line-height:1.6">Las noticias más relevantes de desarrollo y tecnología esta semana.</p>

    <table width="100%" cellpadding="0" cellspacing="0">
      ${articlesHtml}
    </table>

    <div style="margin-top:24px;text-align:center">
      <a href="${BASE_URL}/newsletter"
         style="display:inline-block;padding:11px 28px;background:#22d3ee;color:#0f172a;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700">
        Ver feed completo →
      </a>
    </div>
    ${trackingPixelUrl ? `<img src="${trackingPixelUrl}" width="1" height="1" border="0" alt="" style="display:block;width:1px;height:1px;overflow:hidden;opacity:0" />` : ""}
  `, unsubscribeToken);
}

export function followWelcomeEmailHtml(unsubscribeToken: string) {
  return emailWrapper(`
    <!-- PERFIL -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
      <tr>
        <td style="width:88px;vertical-align:top">
          <img src="${BASE_URL}/img/1760052219751.jpg"
               alt="Iker Martínez"
               width="80" height="80"
               style="display:block;width:80px;height:80px;object-fit:cover;border-radius:10px;border:2px solid #1e3a4a" />
        </td>
        <td style="padding-left:16px;vertical-align:middle">
          <p style="margin:0 0 2px 0;font-size:18px;font-weight:700;color:#f1f5f9">Iker Martínez</p>
          <p style="margin:0 0 6px 0;font-size:13px;color:#22d3ee;font-weight:500">Desarrollador Full Stack</p>
          <span style="display:inline-block;background:#0d2233;border:1px solid #1e3a4a;border-radius:20px;padding:3px 10px;font-size:11px;color:#38bdf8">
            ● Disponible para proyectos
          </span>
        </td>
      </tr>
    </table>

    <!-- MENSAJE -->
    <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#f1f5f9">¡Gracias por seguirme! 👋</h2>
    <p style="margin:0 0 24px 0;color:#94a3b8;font-size:14px;line-height:1.75">
      Me alegra tenerte aquí. Te mantendré al tanto de mis proyectos, el stack que uso y las novedades de mi carrera como desarrollador web full stack.
    </p>

    <!-- LO QUE RECIBIRÁS -->
    <p style="margin:0 0 12px 0;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#475569">Qué puedes esperar</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;overflow:hidden;margin-bottom:28px">
      <tr style="background:#1a2744">
        <td style="padding:13px 16px;border-bottom:1px solid #0f172a">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:28px;font-size:16px">🚀</td>
            <td style="padding-left:8px">
              <span style="color:#e2e8f0;font-size:13px;font-weight:600">Nuevos proyectos</span>
              <span style="display:block;color:#475569;font-size:12px;margin-top:1px">Demos reales desplegados en producción</span>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr style="background:#162038">
        <td style="padding:13px 16px;border-bottom:1px solid #0f172a">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:28px;font-size:16px">📰</td>
            <td style="padding-left:8px">
              <span style="color:#e2e8f0;font-size:13px;font-weight:600">Newsletter de tech</span>
              <span style="display:block;color:#475569;font-size:12px;margin-top:1px">Noticias curadas de desarrollo cada semana</span>
            </td>
          </tr></table>
        </td>
      </tr>
      <tr style="background:#1a2744">
        <td style="padding:13px 16px">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:28px;font-size:16px">💼</td>
            <td style="padding-left:8px">
              <span style="color:#e2e8f0;font-size:13px;font-weight:600">Disponibilidad laboral</span>
              <span style="display:block;color:#475569;font-size:12px;margin-top:1px">Avisos si busco nuevas oportunidades</span>
            </td>
          </tr></table>
        </td>
      </tr>
    </table>

    <!-- CTAs -->
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:12px">
          <a href="${BASE_URL}/projects"
             style="display:inline-block;padding:11px 22px;background:#22d3ee;color:#0f172a;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700">
            Ver proyectos →
          </a>
        </td>
        <td>
          <a href="${BASE_URL}/contact"
             style="display:inline-block;padding:11px 22px;background:transparent;color:#94a3b8;border:1px solid #1e293b;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">
            Contactar
          </a>
        </td>
      </tr>
    </table>
  `, unsubscribeToken);
}
