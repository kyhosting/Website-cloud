const TelegramBot = require("python-telegram-bot");

class TelegramService {
  private botToken: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "";
  }

  async sendOtp(telegramId: string, code: string, email: string): Promise<void> {
    if (!this.botToken) {
      console.warn("TELEGRAM_BOT_TOKEN not configured - OTP will not be sent");
      return;
    }

    try {
      // For production, would use telegram API
      // For now, log OTP (user can check console or implement actual bot)
      console.log(`[TELEGRAM] OTP for ${email}: ${code}`);
      
      // Placeholder for actual Telegram API integration
      // In production, would use python-telegram-bot or axios to send message
    } catch (error) {
      console.error("Failed to send Telegram OTP:", error);
      throw error;
    }
  }

  async sendSystemMessage(telegramId: string, message: string): Promise<void> {
    if (!this.botToken) {
      console.warn("TELEGRAM_BOT_TOKEN not configured");
      return;
    }

    try {
      console.log(`[TELEGRAM] Message to ${telegramId}: ${message}`);
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
    }
  }
}

export const telegramService = new TelegramService();
