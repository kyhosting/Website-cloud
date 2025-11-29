/**
 * 🔐 AUTO-GENERATED CONFIG - KIFZLDEV NEO-2025
 * This file is auto-generated with bot credentials injected from the platform
 * DO NOT EDIT MANUALLY - regenerate from dashboard instead
 */

// Load auto-injected credentials from environment
const token = process.env.TELEGRAM_BOT_TOKEN || "";
const botConfig = JSON.parse(process.env.BOT_CONFIG || "{}");

export default {
  // Auto-injected Bot Token from KIFZLDEV Platform
  token: token,
  
  // Auto-injected Owner ID (Telegram ID) - Array format for bot
  owner: [parseInt(botConfig.telegramId) || 0],
  
  // Owner Username (from user profile)
  ownerUsername: botConfig.userTelegramId || "KIFZLDEV",
  
  // Bot Creator Info / Info Pembuat Bot
  botCreator: "KIFZL & PARTNER/SUPPORT IQBAL DEV",
  
  // Group Configuration / Konfigurasi Grup
  groups: {
    main: "your_group_username",    // Main group / Grup utama
    cv: "your_channel_username"     // Channel CV
  },
  
  // Version & Copyright / Versi & Hak Cipta
  version: "2.1.0",
  copyright: "© 2025 KIFZL & IQBAL DEV. All rights reserved. / Semua hak dilindungi.",
  
  // Watermark - IMPORTANT: DO NOT REMOVE / JANGAN HAPUS
  watermark: "🎌 IQBAL CV BOT - OFFICIAL VERSION 🎌\nPowered by KIFZL & IQBAL DEV"
};
