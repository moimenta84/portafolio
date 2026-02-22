import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import { initDatabase } from "./db/database.js";
import { dispatchToAll } from "./services/newsletter.js";
import { runBackup } from "./services/backup.js";
import { sendWeeklyDigest } from "./services/digest.js";
import { getIp } from "./middleware/getIp.js";
import { authLimiter, contactLimiter, subscriptionLimiter, reviewLimiter, eventsLimiter } from "./middleware/rateLimits.js";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";
import projectsRouter from "./routes/projects.js";
import likesRouter from "./routes/likes.js";
import followersRouter from "./routes/followers.js";
import visitsRouter from "./routes/visits.js";
import newsRouter from "./routes/news.js";
import reviewsRouter from "./routes/reviews.js";
import cvRouter from "./routes/cv.js";
import contactRouter from "./routes/contact.js";
import subscribersRouter from "./routes/subscribers.js";
import auditRouter from "./routes/audit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Confiar en el proxy de Nginx (necesario para que express-rate-limit lea la IP real)
app.set("trust proxy", 1);

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: allowedOrigins.split(",") }));
app.use(express.json());
app.use(getIp);

// API Routes
app.use("/api/auth",        authLimiter,         authRouter);
app.use("/api/projects",                         projectsRouter);
app.use("/api/projects",                         likesRouter);
app.use("/api/followers",   subscriptionLimiter, followersRouter);
app.use("/api/visits",                           visitsRouter);
app.use("/api/news",                             newsRouter);
app.use("/api/reviews",     reviewLimiter,       reviewsRouter);
app.use("/api/cv",                               cvRouter);
app.use("/api/contact",     contactLimiter,      contactRouter);
app.use("/api/subscribers", subscriptionLimiter, subscribersRouter);
app.use("/api/events",     eventsLimiter,       eventsRouter);
app.use("/api/audit",                          auditRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve frontend static files in production
const frontendDist = path.join(__dirname, "..", "..", "Frontend", "dist");
app.use(express.static(frontendDist));
app.get("/{*splat}", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// Init DB and start server
initDatabase();

// Newsletter automático — todos los lunes a las 9:00 (Madrid)
cron.schedule("0 9 * * 1", () => {
  console.log("[cron] Enviando newsletter semanal...");
  dispatchToAll().catch((err) => console.error("[cron] Error newsletter:", err));
}, { timezone: "Europe/Madrid" });

// Backup diario de la BD — cada día a las 3:00 (Madrid)
cron.schedule("0 3 * * *", () => {
  runBackup().catch((err) => console.error("[cron] Error backup:", err));
}, { timezone: "Europe/Madrid" });

// Resumen semanal en Telegram — domingos a las 20:00 (Madrid)
cron.schedule("0 20 * * 0", () => {
  console.log("[cron] Enviando resumen semanal...");
  sendWeeklyDigest().catch((err) => console.error("[cron] Error digest:", err));
}, { timezone: "Europe/Madrid" });

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
