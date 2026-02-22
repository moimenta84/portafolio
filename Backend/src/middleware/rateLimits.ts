import rateLimit from "express-rate-limit";
import type { Request } from "express";

// Las peticiones con token admin (Authorization: Bearer ...) saltan el rate limit
const skipIfAdmin = (req: Request) => !!req.headers.authorization?.startsWith("Bearer ");

// Login: 5 intentos por 15 min (protección contra fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { error: "Demasiados intentos de login. Espera 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Formulario de contacto: 5 mensajes por hora
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { error: "Demasiados mensajes enviados. Espera un momento." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Suscripción / follow: 10 por hora por IP (el admin no aplica)
export const subscriptionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: "Demasiadas solicitudes. Espera un momento." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfAdmin,
});

// Reviews: 3 por hora (evita spam de reseñas; el admin no aplica)
export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: { error: "Solo puedes enviar 3 reseñas por hora." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfAdmin,
});

// Eventos de conversión: 60 por hora por IP
export const eventsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 60,
  message: { error: "Demasiadas peticiones." },
  standardHeaders: true,
  legacyHeaders: false,
});
