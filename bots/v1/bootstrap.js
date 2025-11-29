/**
 * Bot V1 Bootstrap Script - Auto-inject config and start bot
 * Automatically installs dependencies and starts the bot
 * Usage: node bootstrap.js
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function checkAndInstallDependencies() {
  console.log("\n🔍 Checking dependencies...");
  
  const packageJsonPath = path.join(__dirname, "package.json");
  const nodeModulesPath = path.join(__dirname, "node_modules");
  
  // Check if node_modules exists
  if (!fs.existsSync(nodeModulesPath)) {
    console.log("📦 node_modules not found. Installing dependencies...");
    console.log("⏳ This may take a few minutes...\n");
    
    try {
      execSync("npm install --production", {
        cwd: __dirname,
        stdio: "inherit",
        timeout: 300000 // 5 minutes timeout
      });
      console.log("\n✅ Dependencies installed successfully!\n");
    } catch (error) {
      console.error("❌ Failed to install dependencies");
      console.error(error.message);
      process.exit(1);
    }
  } else {
    console.log("✅ Dependencies already installed\n");
  }
}

async function bootstrap() {
  console.log("🚀 Bot V1 Bootstrap - KIFZLDEV NEO-2025");
  console.log("========================================");

  // Check and install dependencies first
  checkAndInstallDependencies();

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
