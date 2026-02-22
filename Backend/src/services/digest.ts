import db from "../db/database.js";
import { sendTelegram } from "./notifications.js";

export async function sendWeeklyDigest(): Promise<void> {
  const visitors = (db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits WHERE created_at >= datetime('now', '-7 days')"
  ).get() as { c: number }).c;

  const cvDownloads = (db.prepare(
    "SELECT COUNT(*) as c FROM cv_downloads WHERE created_at >= datetime('now', '-7 days')"
  ).get() as { c: number }).c;

  const newFollowers = (db.prepare(
    "SELECT COUNT(*) as c FROM followers WHERE created_at >= datetime('now', '-7 days')"
  ).get() as { c: number }).c;

  const newSubscribers = (db.prepare(
    "SELECT COUNT(*) as c FROM subscribers WHERE created_at >= datetime('now', '-7 days')"
  ).get() as { c: number }).c;

  const contacts = (db.prepare(
    "SELECT COUNT(*) as c FROM events WHERE type = 'contact_submit' AND created_at >= datetime('now', '-7 days')"
  ).get() as { c: number }).c;

  const projectClicks = (db.prepare(
    "SELECT COUNT(*) as c FROM events WHERE type = 'project_click' AND created_at >= datetime('now', '-7 days')"
  ).get() as { c: number }).c;

  const totalVisitors = (db.prepare(
    "SELECT COUNT(DISTINCT ip) as c FROM visits"
  ).get() as { c: number }).c;

  const week = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const message =
    `📊 <b>Resumen semanal del portfolio</b>\n` +
    `<i>${week}</i>\n\n` +
    `👁 Visitas únicas: <b>${visitors}</b>\n` +
    `📄 CV descargados: <b>${cvDownloads}</b>\n` +
    `🔗 Clics en proyectos: <b>${projectClicks}</b>\n` +
    `✉️ Contactos recibidos: <b>${contacts}</b>\n` +
    `👤 Nuevos seguidores: <b>${newFollowers}</b>\n` +
    `📧 Nuevos suscriptores: <b>${newSubscribers}</b>\n\n` +
    `📈 Visitantes histórico total: <b>${totalVisitors}</b>`;

  console.log("[digest] Enviando resumen semanal a Telegram...");
  await sendTelegram(message);
  console.log("[digest] ✅ Resumen semanal enviado");
}
