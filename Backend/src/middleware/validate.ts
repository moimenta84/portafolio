import type { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? "Datos inválidos";
      res.status(400).json({ error: message });
      return;
    }
    req.body = result.data;
    next();
  };
}

export const reviewSchema = z.object({
  name:    z.string().min(1, "El nombre es obligatorio").max(100, "Nombre demasiado largo").trim(),
  comment: z.string().min(1, "El comentario es obligatorio").max(500, "Comentario demasiado largo").trim(),
  rating:  z.coerce.number().int().min(1, "La valoración mínima es 1").max(5, "La valoración máxima es 5"),
});

export const contactSchema = z.object({
  name:    z.string().min(1, "El nombre es obligatorio").max(100).trim(),
  email:   z.string().email("Email no válido").max(200),
  subject: z.string().min(1, "El asunto es obligatorio").max(200).trim(),
  message: z.string().min(1, "El mensaje es obligatorio").max(2000).trim(),
});

export const projectSchema = z.object({
  title:       z.string().min(1, "El título es obligatorio").max(200).trim(),
  description: z.string().max(1000).trim().optional().default(""),
  image:       z.string().url("URL de imagen no válida").max(500).optional().or(z.literal("")).default(""),
  tech:        z.array(z.string().max(50)).max(15).optional().default([]),
  link:        z.string().url("URL del proyecto no válida").max(500).optional().or(z.literal("")).default(""),
});

export const projectUpdateSchema = projectSchema.partial().extend({
  title: z.string().min(1).max(200).trim().optional(),
});

export const subscriberSchema = z.object({
  email: z.string().email("Email no válido").max(200),
});
