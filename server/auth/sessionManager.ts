import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express } from "express";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });

  // Handle session store errors gracefully
  sessionStore.on("error", (error: any) => {
    if (error.code === "57P01" || error.message?.includes("administrator command")) {
      return;
    }
    console.error("Session store error:", error.message);
  });

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

export function setupSessionMiddleware(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
}
