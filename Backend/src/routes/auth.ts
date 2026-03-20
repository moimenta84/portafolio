import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { logAudit } from "../utils/audit.js";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET!;
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
  const { password } = req.body;
  const ip = req.clientIp || "";

  const valid = password && await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

  if (!valid) {
    logAudit("LOGIN_FAILED", "Contraseña incorrecta", ip);
    res.status(401).json({ error: "Contraseña incorrecta" });
    return;
  }

  logAudit("LOGIN_SUCCESS", "Acceso al panel de administración", ip);
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token });
});

export default router;
