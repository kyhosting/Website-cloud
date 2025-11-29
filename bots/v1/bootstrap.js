/**
 * Bot V1 Bootstrap Script - Auto-inject config and start bot
 * Usage: node bootstrap.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    const botConfig = JSON.parse(configJson);
    
    console.log("✅ Config loaded from environment");
    console.log("📦 Bot Token: " + (botConfig.botToken ? "●●●●●●●●●●●●●●●●●●" : "NOT SET"));
    console.log("📦 Telegram ID: " + botConfig.telegramId);
    console.log("📦 Bot ID: " + botConfig.botId);
    console.log("📦 User ID: " + botConfig.userId);
    console.log("📦 Premium: " + (botConfig.isPremium ? "YES ✓" : "NO"));
    
    // Set environment variables for bot
    process.env.TELEGRAM_BOT_TOKEN = botConfig.botToken;
    process.env.OWNER_ID = botConfig.telegramId;
    process.env.BOT_ID = botConfig.botId;
    process.env.USER_ID = botConfig.userId;
    
    // Create auto-generated config.js with matched structure
    const configContent = `// 🔐 AUTO-GENERATED CONFIG - KIFZLDEV NEO-2025
// Do not commit this file with real tokens!

const token = process.env.TELEGRAM_BOT_TOKEN || "${botConfig.botToken}";

export default {
  token: token,
  owner: [${botConfig.telegramId}],
  ownerUsername: "${botConfig.userTelegramId || "KIFZLDEV"}",
  botCreator: "KIFZL & PARTNER/SUPPORT IQBAL DEV",
  groups: {
    main: "your_group_username",
    cv: "your_channel_username"
  },
  version: "2.1.0",
  copyright: "© 2025 KIFZL & IQBAL DEV. All rights reserved.",
  watermark: "🎌 IQBAL CV BOT - OFFICIAL VERSION 🎌\\nPowered by KIFZL & IQBAL DEV"
};
`;
    
    fs.writeFileSync(path.join(__dirname, "config.js"), configContent);
    console.log("📝 config.js generated from auto-injected credentials");
    
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
