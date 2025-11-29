import type { Express, RequestHandler } from "express";
import { setupSessionMiddleware } from "./sessionManager";

export async function setupNewAuth(app: Express) {
  // Setup session middleware
  setupSessionMiddleware(app);

  // Session serialization
  app.use((req, res, next) => {
    if (req.session && req.session.userId) {
      (req as any).userId = req.session.userId;
      (req as any).user = {
        id: req.session.userId,
        email: req.session.email,
      };
    }
    next();
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // In a real app, fetch user from DB and check role
  // For now, placeholder
  next();
};

declare global {
  namespace Express {
    interface Session {
      userId?: string;
      email?: string;
    }
  }
}
