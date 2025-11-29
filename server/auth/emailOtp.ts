import { storage } from "../storage";
import { telegramService } from "../services/telegram";

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOtp(email: string, telegramId: string): Promise<string> {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const otp = await storage.createOtp({
    email,
    telegramId,
    code,
    expiresAt,
  });

  // Send OTP via Telegram
  try {
    await telegramService.sendOtp(telegramId, code, email);
  } catch (error) {
    console.error("Failed to send OTP via Telegram:", error);
    throw new Error("Failed to send OTP. Make sure Telegram ID is correct.");
  }

  return otp.id;
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const otp = await storage.getValidOtp(email, code);

  if (!otp) {
    return false;
  }

  if (otp.attempts >= 5) {
    return false; // Too many attempts
  }

  await storage.markOtpUsed(otp.id);
  return true;
}

export async function incrementOtpAttempts(email: string, code: string): Promise<void> {
  const otp = await storage.getValidOtp(email, code);
  if (otp) {
    await storage.incrementOtpAttempts(otp.id);
  }
}

export async function upsertEmailUser(email: string, telegramId: string) {
  const existingUser = await storage.getUserByEmail(email);

  if (existingUser) {
    // Update existing user with telegramId if not set
    if (!existingUser.telegramId) {
      return await storage.updateUser(existingUser.id, { telegramId });
    }
    return existingUser;
  }

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const visibleId = `KIFZUSR-${randomNum}`;

  return await storage.upsertUser({
    id: `email_${email}`,
    visibleId,
    email,
    telegramId,
  });
}
