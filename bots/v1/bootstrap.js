/**
 * Bot V1 Bootstrap Script - Auto-inject config and start bot
 * Usage: node bootstrap.js --config=<config-json-or-env-var>
 */

import fs from "fs";
import path from "path";

async function bootstrap() {
  console.log("🚀 Bot V1 Bootstrap - KIFZLDEV NEO-2025");
  console.log("========================================\n");

  // Get config from environment
  const configJson = process.env.BOT_CONFIG;
  
  if (!configJson) {
    console.error("❌ BOT_CONFIG environment variable not set!");
    console.error("   Set it with: export BOT_CONFIG='<json-config>'");
    process.exit(1);
  }

  try {
    const config = JSON.parse(configJson);
    
    console.log("✅ Config loaded from environment");
    console.log("📦 Bot Token: " + (config.botToken ? "●●●●●●●●●●●●●●●●●●" : "NOT SET"));
    console.log("📦 Telegram ID: " + config.telegramId);
    console.log("📦 Bot ID: " + config.botId);
    console.log("📦 User ID: " + config.userId);
    console.log("📦 Premium: " + (config.isPremium ? "YES ✓" : "NO"));
    
    // Set environment variables for bot
    process.env.TELEGRAM_BOT_TOKEN = config.botToken;
    process.env.OWNER_ID = config.telegramId;
    process.env.BOT_ID = config.botId;
    process.env.USER_ID = config.userId;
    
    console.log("\n✅ All environment variables set!");
    console.log("🔧 Starting bot index.js...\n");
    
    // Import and start the main bot
    const botModule = await import("./index.js");
    
  } catch (error) {
    console.error("❌ Bootstrap failed:");
    console.error(error.message);
    process.exit(1);
  }
}

bootstrap();
