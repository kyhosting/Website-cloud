import type { Express } from "express";
import { isAuthenticated } from "../auth/newAuth";
import { storage } from "../storage";
import { getGoogleAuthUrl, exchangeGoogleCode, upsertGoogleUser } from "../auth/googleOAuth";
import { requestOtp, verifyOtp, upsertEmailUser, incrementOtpAttempts } from "../auth/emailOtp";

export function registerAuthRoutes(app: Express) {
  // Get current user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Google OAuth - redirect to Google
  app.get("/api/auth/google", (req, res) => {
    try {
      const authUrl = getGoogleAuthUrl();
      res.redirect(authUrl);
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ message: "Failed to initiate Google login" });
    }
  });

  // Google OAuth - callback
  app.get("/api/auth/google/callback", async (req: any, res) => {
    try {
      const { code } = req.query;

      if (!code) {
        return res.redirect("/login?error=no_code");
      }

      const userInfo = await exchangeGoogleCode(code as string);
      const user = await upsertGoogleUser(userInfo);

      // Set session
      if (req.session) {
        req.session.userId = user.id;
        req.session.email = user.email;
      }

      // Redirect to dashboard
      res.redirect("/");
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("/login?error=auth_failed");
    }
  });

  // Email OTP - request OTP
  app.post("/api/auth/email/request-otp", async (req: any, res) => {
    try {
      const { email, telegramId } = req.body;

      if (!email || !telegramId) {
        return res.status(400).json({ message: "Email dan Telegram ID diperlukan" });
      }

      await requestOtp(email, telegramId);
      res.json({ message: "OTP terkirim ke Telegram" });
    } catch (error: any) {
      console.error("OTP request error:", error);
      res.status(500).json({ message: error.message || "Failed to send OTP" });
    }
  });

  // Email OTP - verify OTP
  app.post("/api/auth/email/verify-otp", async (req: any, res) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ message: "Email dan OTP diperlukan" });
      }

      const isValid = await verifyOtp(email, code);

      if (!isValid) {
        // Increment attempts
        await incrementOtpAttempts(email, code);
        return res.status(400).json({ message: "OTP tidak valid atau sudah expired" });
      }

      // Extract telegram ID from OTP record (need to get it)
      // For now, we'll need to update this logic
      // Create or get user
      const existingUser = await storage.getUserByEmail(email);
      let user;

      if (existingUser) {
        user = existingUser;
      } else {
        // This is problematic - we need telegramId
        // We should store it with OTP or pass it separately
        return res.status(400).json({ message: "User not found" });
      }

      // Set session
      if (req.session) {
        req.session.userId = user.id;
        req.session.email = user.email;
      }

      res.json({ message: "Login successful" });
    } catch (error) {
      console.error("OTP verify error:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  // Logout
  app.get("/api/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.redirect("/login");
    });
  });
}
