import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../db/database.js";
import { sendTelegram } from "./notifications.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_DIR = path.join(__dirname, "..", "..", "..", "backups");
const KEEP_DAYS = 7;

export async function runBackup(): Promise<void> {
  // Crear directorio si no existe
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const dest = path.join(BACKUP_DIR, `portfolio_${date}.db`);

  try {
    // better-sqlite3 .backup() crea una copia consistente aunque la BD esté activa
    await db.backup(dest);
    console.log(`[backup] ✅ Backup guardado: ${dest}`);

    rotateOldBackups();

    await sendTelegram(`✅ <b>Backup diario completado</b>\n📁 <code>portfolio_${date}.db</code>`);
  } catch (err) {
    const msg = (err as Error).message;
    console.error(`[backup] ❌ Error: ${msg}`);
    await sendTelegram(`❌ <b>Backup fallido</b>\n${msg}`);
  }
}

function rotateOldBackups() {
  const cutoff = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;
  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith("portfolio_") && f.endsWith(".db"));

  for (const file of files) {
    const filePath = path.join(BACKUP_DIR, file);
    const { mtimeMs } = fs.statSync(filePath);
    if (mtimeMs < cutoff) {
      fs.unlinkSync(filePath);
      console.log(`[backup] 🗑️ Backup antiguo eliminado: ${file}`);
    }
  }
}
