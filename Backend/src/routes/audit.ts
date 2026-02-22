import { Router } from "express";
import db from "../db/database.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// GET /api/audit - Últimas 100 entradas del log de seguridad (admin)
router.get("/", requireAuth, (_req, res) => {
  const rows = db
    .prepare(
      "SELECT id, action, details, ip, created_at FROM audit_log ORDER BY created_at DESC LIMIT 100"
    )
    .all();
  res.json(rows);
});

export default router;
