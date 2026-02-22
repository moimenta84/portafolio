import { Router } from "express";
import jwt from "jsonwebtoken";
import { logAudit } from "../utils/audit.js";

const router = Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
  const { password } = req.body;
  const ip = req.clientIp || "";

  if (!password || password !== ADMIN_PASSWORD) {
    logAudit("LOGIN_FAILED", "Contraseña incorrecta", ip);
    res.status(401).json({ error: "Contraseña incorrecta" });
    return;
  }

  logAudit("LOGIN_SUCCESS", "Acceso al panel de administración", ip);
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

export default router;
