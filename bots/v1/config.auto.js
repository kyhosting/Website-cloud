/**
 * 🔐 AUTO-GENERATED CONFIG - KIFZLDEV NEO-2025
 * This file is auto-generated with bot credentials injected from the platform
 * DO NOT EDIT MANUALLY - regenerate from dashboard instead
 */

import fs from "fs";

// Load auto-injected credentials from environment or config file
const autoConfig = JSON.parse(process.env.BOT_CONFIG || "{}");

export default {
  // Auto-injected Bot Token from KIFZLDEV Platform
  token: autoConfig.botToken || process.env.TELEGRAM_BOT_TOKEN || "",
  
  // Auto-injected Owner ID (Telegram ID)
  owner: [parseInt(autoConfig.telegramId) || 0],
  
  // Owner Username (from user profile)
  ownerUsername: autoConfig.userTelegramId || "OWNER",
  
  // Bot Creator Info
  botCreator: "KIFZL & PARTNER/SUPPORT IQBAL DEV",
  
  // Group Configuration
  groups: {
    main: autoConfig.mainGroup || "main_group",
    cv: autoConfig.cvChannel || "cv_channel"
  },
  
  // Version & Copyright
  version: "2.1.0",
  copyright: "© 2025 KIFZL & IQBAL DEV. All rights reserved.",
  
  // Platform Integration
  platform: {
    botId: autoConfig.botId,
    userId: autoConfig.userId,
    apiBaseUrl: autoConfig.apiBaseUrl || "https://kifzldev-cloud.devpanel.me/api",
    webhookUrl: autoConfig.webhookUrl,
    isPremium: autoConfig.isPremium || false,
    premiumExpiry: autoConfig.premiumExpiry
  },
  
  // Watermark
  watermark: "🎌 IQBAL CV BOT - OFFICIAL VERSION 🎌\nPowered by KIFZL & IQBAL DEV"
};
