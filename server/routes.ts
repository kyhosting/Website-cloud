import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { botManager } from "./botManager";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads", "payments");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

export async function registerRoutes(server: Server, app: Express): Promise<void> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== BOT ROUTES ====================
  
  // Get user's bots
  app.get("/api/bots", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bots = await storage.getBotsByUserId(userId);
      res.json(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ message: "Failed to fetch bots" });
    }
  });

  // Create new bot
  app.post("/api/bots", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check bot limit
      if (user.totalBots >= user.maxBots) {
        return res.status(400).json({ message: "Bot limit reached. Upgrade to premium for more bots!" });
      }

      // Check V2 access
      if (req.body.version === "v2" && user.premiumStatus !== "premium" && user.role !== "admin") {
        return res.status(403).json({ message: "Bot V2 requires premium subscription" });
      }

      const botData = {
        ...req.body,
        userId,
        status: "offline" as const,
        cpuUsage: 0,
        ramUsage: 0,
        ping: 0,
        uptime: 0,
      };

      const bot = await storage.createBot(botData);
      res.status(201).json(bot);
    } catch (error) {
      console.error("Error creating bot:", error);
      res.status(500).json({ message: "Failed to create bot" });
    }
  });

  // Delete bot
  app.delete("/api/bots/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bot = await storage.getBotById(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      if (bot.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteBot(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({ message: "Failed to delete bot" });
    }
  });

  // Get bot config (auto-injected)
  app.get("/api/bots/:id/config", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bot = await storage.getBotById(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      if (bot.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await storage.getUser(userId);
      
      // Generate auto-injected config
      const config = {
        // Bot credentials (auto-injected)
        botToken: bot.botToken,
        telegramId: bot.telegramId,
        
        // User info
        userId: user?.visibleId || userId,
        userTelegramId: user?.telegramId,
        
        // Premium status
        isPremium: user?.premiumStatus === "premium",
        premiumExpiry: user?.premiumExpiry,
        
        // Bot info
        botId: bot.id,
        botVersion: bot.version,
        
        // API endpoints
        apiBaseUrl: `https://${req.hostname}/api`,
        webhookUrl: `https://${req.hostname}/api/webhook/bot/${bot.id}`,
        
        // Server config
        environment: process.env.NODE_ENV || "production",
        serverTime: new Date().toISOString(),
      };

      res.json(config);
    } catch (error) {
      console.error("Error generating bot config:", error);
      res.status(500).json({ message: "Failed to generate config" });
    }
  });

  // Get bot deployment script
  app.get("/api/bots/:id/deploy/:version", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bot = await storage.getBotById(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      if (bot.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const user = await storage.getUser(userId);
      
      const config = {
        botToken: bot.botToken,
        telegramId: bot.telegramId,
        userId: user?.visibleId || userId,
        userTelegramId: user?.telegramId,
        isPremium: user?.premiumStatus === "premium",
        premiumExpiry: user?.premiumExpiry,
        botId: bot.id,
        botVersion: bot.version,
        apiBaseUrl: `https://${req.hostname}/api`,
        webhookUrl: `https://${req.hostname}/api/webhook/bot/${bot.id}`,
      };

      const deployVersion = req.params.version;
      let script = "";

      if (deployVersion === "v1") {
        script = `#!/bin/bash
# Bot V1 (NodeJS) - Deployment Script
# Generated by KIFZLDEV NEO-2025

export BOT_CONFIG='${JSON.stringify(config)}'
export NODE_ENV=production

# Install dependencies
cd /path/to/bots/v1
npm install --production

# Start bot with auto-injected config
node bootstrap.js`;
      } else if (deployVersion === "v2") {
        script = `#!/bin/bash
# Bot V2 (Python) - Deployment Script
# Generated by KIFZLDEV NEO-2025

export BOT_CONFIG='${JSON.stringify(config)}'
export TELEGRAM_BOT_TOKEN='${config.botToken}'
export OWNER_ID=${config.telegramId}
export BOT_ID='${config.botId}'
export USER_ID='${config.userId}'

# Install dependencies
cd /path/to/bots/v2
pip install -r requirements.txt

# Start bot with auto-injected config
python bootstrap.py`;
      } else {
        return res.status(400).json({ message: "Invalid bot version" });
      }

      res.type("text/plain").send(script);
    } catch (error) {
      console.error("Error generating deploy script:", error);
      res.status(500).json({ message: "Failed to generate deployment script" });
    }
  });

  // Restart bot
  app.post("/api/bots/:id/restart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bot = await storage.getBotById(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      if (bot.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Actually spawn/restart the bot process
      const success = await botManager.restartBot(
        req.params.id,
        bot.botToken,
        bot.telegramId,
        bot.version as "v1" | "v2"
      );

      if (success) {
        res.json({ message: "Bot restarted successfully and connected to Telegram!" });
      } else {
        res.status(500).json({ message: "Failed to start bot process" });
      }
    } catch (error) {
      console.error("Error restarting bot:", error);
      res.status(500).json({ message: "Failed to restart bot" });
    }
  });

  // Get bot logs
  app.get("/api/bots/:id/logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bot = await storage.getBotById(req.params.id);
      
      if (!bot) {
        return res.status(404).json({ message: "Bot not found" });
      }
      
      if (bot.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const lines = parseInt(req.query.lines || "50");
      const logs = botManager.getBotLogs(req.params.id, lines);
      
      res.json({ logs });
    } catch (error) {
      console.error("Error fetching bot logs:", error);
      res.status(500).json({ message: "Failed to fetch logs" });
    }
  });

  // ==================== PREMIUM ROUTES ====================

  // Get premium packages
  app.get("/api/premium/packages", async (req, res) => {
    try {
      const packages = await storage.getPremiumPackages();
      
      // If no packages exist, create default ones
      if (packages.length === 0) {
        const defaultPackages = [
          { name: "7 Hari", durationDays: 7, price: 25000, maxBots: 10, features: ["Bot V2", "10 Bot", "Prioritas CPU"], isActive: true },
          { name: "30 Hari", durationDays: 30, price: 75000, maxBots: 10, features: ["Bot V2", "10 Bot", "Prioritas CPU", "Support Prioritas"], isActive: true },
          { name: "90 Hari", durationDays: 90, price: 180000, maxBots: 15, features: ["Bot V2", "15 Bot", "Prioritas CPU", "Support Prioritas", "Early Access"], isActive: true },
        ];
        // Return default packages for display
        return res.json(defaultPackages.map((p, i) => ({ ...p, id: `pkg-${i}` })));
      }
      
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  // Get pending payment
  app.get("/api/payments/pending", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payment = await storage.getPendingPaymentByUserId(userId);
      res.json(payment || null);
    } catch (error) {
      console.error("Error fetching pending payment:", error);
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  });

  // Create payment with proof upload
  app.post("/api/payments", isAuthenticated, upload.single("proof"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Check for existing pending payment
      const existingPayment = await storage.getPendingPaymentByUserId(userId);
      if (existingPayment) {
        return res.status(400).json({ message: "You already have a pending payment" });
      }

      const paymentData = {
        userId,
        packageId: req.body.packageId,
        amount: parseInt(req.body.amount),
        status: "pending" as const,
        proofImageUrl: req.file ? `/uploads/payments/${req.file.filename}` : null,
      };

      const payment = await storage.createPayment(paymentData);
      res.status(201).json(payment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // ==================== ADMIN ROUTES ====================

  // Admin stats
  app.get("/api/admin/stats", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userStats = await storage.getUserStats();
      const botStats = await storage.getBotStats();
      const pendingPayments = await storage.getPendingPayments();
      const allPayments = await storage.getAllPayments();
      const securityLogs = await storage.getSecurityLogs(10);

      const totalRevenue = allPayments
        .filter(p => p.status === "approved")
        .reduce((sum, p) => sum + p.amount, 0);

      res.json({
        ...userStats,
        ...botStats,
        pendingPayments: pendingPayments.length,
        totalRevenue,
        securityAlerts: securityLogs.filter(l => l.eventType.includes("alert") || l.eventType.includes("error")).length,
        activeV2Bots: botStats.v2Bots,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin - Get all users
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin - Update user
  app.patch("/api/admin/users/:id", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Admin - Get all payments
  app.get("/api/admin/payments", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      
      // Enrich with user data
      const enrichedPayments = await Promise.all(
        payments.map(async (payment) => {
          const user = await storage.getUser(payment.userId);
          const pkg = payment.packageId ? await storage.getPremiumPackageById(payment.packageId) : null;
          return {
            ...payment,
            user: user ? {
              visibleId: user.visibleId,
              email: user.email,
              firstName: user.firstName,
            } : null,
            package: pkg ? {
              name: pkg.name,
              durationDays: pkg.durationDays,
            } : null,
          };
        })
      );
      
      res.json(enrichedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Admin - Process payment
  app.post("/api/admin/payments/:id/process", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const { status, note } = req.body;
      const adminId = req.user.claims.sub;

      const payment = await storage.updatePayment(req.params.id, {
        status,
        adminNote: note,
        processedBy: adminId,
        processedAt: new Date(),
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // If approved, upgrade user to premium
      if (status === "approved" && payment.packageId) {
        const pkg = await storage.getPremiumPackageById(payment.packageId);
        if (pkg) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + pkg.durationDays);
          
          await storage.updateUser(payment.userId, {
            premiumStatus: "premium",
            premiumExpiry: expiryDate,
            maxBots: pkg.maxBots,
          });
        }
      }

      res.json(payment);
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  // Admin - Get all bots
  app.get("/api/admin/bots", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const bots = await storage.getAllBots();
      res.json(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ message: "Failed to fetch bots" });
    }
  });

  // Serve uploaded files
  app.use("/uploads/payments", (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });
}
