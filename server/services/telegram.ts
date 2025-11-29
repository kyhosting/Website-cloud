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
      // For production, would use Telegram Bot API
      // For now, log OTP (user can check console or implement actual bot)
      console.log(`[TELEGRAM OTP] User ${telegramId} | Code: ${code} | Email: ${email}`);
      
      // In production: use axios to call Telegram API or python-telegram-bot library
      // POST https://api.telegram.org/bot{botToken}/sendMessage
      // with chat_id={telegramId}, text=OTP_CODE
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
      console.log(`[TELEGRAM MSG] To ${telegramId}: ${message}`);
      
      // In production: use Telegram API
    } catch (error) {
      console.error("Failed to send Telegram message:", error);
    }
  }
}

export const telegramService = new TelegramService();
