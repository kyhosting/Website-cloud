import type { Express } from "express";
import { isAuthenticated, isAdmin } from "../auth/newAuth";
import { storage } from "../storage";

export function registerV2ActivateRoutes(app: Express) {
  // OPSI 1: Admin activate V2 untuk user tertentu
  app.post("/api/admin/v2/user", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { userId, botToken, telegramId } = req.body;

      if (!userId || !botToken || !telegramId) {
        return res.status(400).json({ message: "userId, botToken, dan telegramId diperlukan" });
      }

      // Check user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // Check bot limit (unless admin)
      if (user.totalBots >= user.maxBots) {
        return res.status(400).json({ message: "Bot limit tercapai" });
      }

      // Create bot V2 for user
      const bot = await storage.createBot({
        userId,
        botToken,
        telegramId,
        version: "v2" as const,
        status: "offline" as const,
        isAdminBot: false,
      });

      res.status(201).json(bot);
    } catch (error) {
      console.error("V2 activation error:", error);
      res.status(500).json({ message: "Gagal mengaktifkan Bot V2" });
    }
  });

  // OPSI 2: Admin activate V2 untuk diri sendiri (multi bot)
  app.post("/api/admin/v2/self", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { botToken, telegramId } = req.body;
      const adminId = req.session?.userId;

      if (!botToken || !telegramId) {
        return res.status(400).json({ message: "botToken dan telegramId diperlukan" });
      }

      // Create admin bot (no limit, isAdminBot = true)
      const bot = await storage.createBot({
        userId: adminId,
        botToken,
        telegramId,
        version: "v2" as const,
        status: "offline" as const,
        isAdminBot: true,
      });

      res.status(201).json(bot);
    } catch (error) {
      console.error("Admin V2 activation error:", error);
      res.status(500).json({ message: "Gagal mengaktifkan Bot V2 Admin" });
    }
  });

  // Get admin's own V2 bots (multi)
  app.get("/api/admin/v2/self", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const adminId = req.session?.userId;
      const bots = await storage.getBotsByUserId(adminId);
      const adminBots = bots.filter((b) => b.isAdminBot && b.version === "v2");
      res.json(adminBots);
    } catch (error) {
      console.error("Error fetching admin V2 bots:", error);
      res.status(500).json({ message: "Failed to fetch admin bots" });
    }
  });
}
