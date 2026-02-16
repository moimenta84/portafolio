import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      clientIp?: string;
    }
  }
}

export function getIp(req: Request, _res: Response, next: NextFunction) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string"
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "unknown";
  req.clientIp = ip;
  next();
}
