import db from "../db/database.js";

export function logAudit(action: string, details: string, ip?: string) {
  try {
    db.prepare("INSERT INTO audit_log (action, details, ip) VALUES (?, ?, ?)").run(
      action,
      details,
      ip ?? ""
    );
  } catch {
    // no bloqueamos el flujo si el log falla
  }
}
