import {
  users,
  bots,
  payments,
  otpCodes,
  securityLogs,
  adminMessages,
  premiumPackages,
  type User,
  type UpsertUser,
  type Bot,
  type InsertBot,
  type Payment,
  type InsertPayment,
  type OtpCode,
  type InsertOtp,
  type SecurityLog,
  type InsertSecurityLog,
  type AdminMessage,
  type InsertAdminMessage,
  type PremiumPackage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gt, sql } from "drizzle-orm";

// Generate KIFZUSR-XXXXXX ID
function generateVisibleId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `KIFZUSR-${randomNum}`;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVisibleId(visibleId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<{ totalUsers: number; premiumUsers: number }>;

  // Bot operations
  getBotsByUserId(userId: string): Promise<Bot[]>;
  getBotById(id: string): Promise<Bot | undefined>;
  createBot(bot: InsertBot): Promise<Bot>;
  updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined>;
  deleteBot(id: string): Promise<void>;
  getAllBots(): Promise<Bot[]>;
  getBotStats(): Promise<{ totalBots: number; onlineBots: number; v2Bots: number }>;

  // Payment operations
  getPaymentsByUserId(userId: string): Promise<Payment[]>;
  getPendingPaymentByUserId(userId: string): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  getPendingPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined>;

  // OTP operations
  createOtp(otp: InsertOtp): Promise<OtpCode>;
  getValidOtp(email: string, code: string): Promise<OtpCode | undefined>;
  markOtpUsed(id: string): Promise<void>;
  incrementOtpAttempts(id: string): Promise<void>;

  // Security logs
  createSecurityLog(log: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(limit?: number): Promise<SecurityLog[]>;

  // Admin messages
  getMessagesByUserId(userId: string): Promise<AdminMessage[]>;
  createMessage(message: InsertAdminMessage): Promise<AdminMessage>;
  markMessageRead(id: string): Promise<void>;

  // Premium packages
  getPremiumPackages(): Promise<PremiumPackage[]>;
  getPremiumPackageById(id: string): Promise<PremiumPackage | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByVisibleId(visibleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.visibleId, visibleId));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Generate visibleId if not exists
    const visibleId = userData.visibleId || generateVisibleId();
    
    const [user] = await db
      .insert(users)
      .values({ ...userData, visibleId })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserStats(): Promise<{ totalUsers: number; premiumUsers: number }> {
    const allUsers = await db.select().from(users);
    const premiumUsers = allUsers.filter(u => u.premiumStatus === "premium");
    return {
      totalUsers: allUsers.length,
      premiumUsers: premiumUsers.length,
    };
  }

  // Bot operations
  async getBotsByUserId(userId: string): Promise<Bot[]> {
    return await db.select().from(bots).where(eq(bots.userId, userId)).orderBy(desc(bots.createdAt));
  }

  async getBotById(id: string): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot;
  }

  async createBot(botData: InsertBot): Promise<Bot> {
    const [bot] = await db.insert(bots).values(botData).returning();
    
    // Update user's bot count
    await db
      .update(users)
      .set({ 
        totalBots: sql`${users.totalBots} + 1`,
        updatedAt: new Date()
      })
      .where(eq(users.id, botData.userId));
    
    return bot;
  }

  async updateBot(id: string, updates: Partial<Bot>): Promise<Bot | undefined> {
    const [bot] = await db
      .update(bots)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bots.id, id))
      .returning();
    return bot;
  }

  async deleteBot(id: string): Promise<void> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    if (bot) {
      await db.delete(bots).where(eq(bots.id, id));
      
      // Update user's bot count
      await db
        .update(users)
        .set({ 
          totalBots: sql`GREATEST(${users.totalBots} - 1, 0)`,
          updatedAt: new Date()
        })
        .where(eq(users.id, bot.userId));
    }
  }

  async getAllBots(): Promise<Bot[]> {
    return await db.select().from(bots).orderBy(desc(bots.createdAt));
  }

  async getBotStats(): Promise<{ totalBots: number; onlineBots: number; v2Bots: number }> {
    const allBots = await db.select().from(bots);
    const onlineBots = allBots.filter(b => b.status === "online");
    const v2Bots = allBots.filter(b => b.version === "v2");
    return {
      totalBots: allBots.length,
      onlineBots: onlineBots.length,
      v2Bots: v2Bots.length,
    };
  }

  // Payment operations
  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  async getPendingPaymentByUserId(userId: string): Promise<Payment | undefined> {
    const [payment] = await db
      .select()
      .from(payments)
      .where(and(eq(payments.userId, userId), eq(payments.status, "pending")));
    return payment;
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPendingPayments(): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.status, "pending")).orderBy(desc(payments.createdAt));
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(paymentData).returning();
    return payment;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const [payment] = await db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return payment;
  }

  // OTP operations
  async createOtp(otpData: InsertOtp): Promise<OtpCode> {
    const [otp] = await db.insert(otpCodes).values(otpData).returning();
    return otp;
  }

  async getValidOtp(email: string, code: string): Promise<OtpCode | undefined> {
    const [otp] = await db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          eq(otpCodes.isUsed, false),
          gt(otpCodes.expiresAt, new Date())
        )
      );
    return otp;
  }

  async markOtpUsed(id: string): Promise<void> {
    await db.update(otpCodes).set({ isUsed: true }).where(eq(otpCodes.id, id));
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await db
      .update(otpCodes)
      .set({ attempts: sql`${otpCodes.attempts} + 1` })
      .where(eq(otpCodes.id, id));
  }

  // Security logs
  async createSecurityLog(logData: InsertSecurityLog): Promise<SecurityLog> {
    const [log] = await db.insert(securityLogs).values(logData).returning();
    return log;
  }

  async getSecurityLogs(limit = 100): Promise<SecurityLog[]> {
    return await db.select().from(securityLogs).orderBy(desc(securityLogs.createdAt)).limit(limit);
  }

  // Admin messages
  async getMessagesByUserId(userId: string): Promise<AdminMessage[]> {
    return await db.select().from(adminMessages).where(eq(adminMessages.userId, userId)).orderBy(desc(adminMessages.createdAt));
  }

  async createMessage(messageData: InsertAdminMessage): Promise<AdminMessage> {
    const [message] = await db.insert(adminMessages).values(messageData).returning();
    return message;
  }

  async markMessageRead(id: string): Promise<void> {
    await db.update(adminMessages).set({ isRead: true }).where(eq(adminMessages.id, id));
  }

  // Premium packages
  async getPremiumPackages(): Promise<PremiumPackage[]> {
    return await db.select().from(premiumPackages).where(eq(premiumPackages.isActive, true));
  }

  async getPremiumPackageById(id: string): Promise<PremiumPackage | undefined> {
    const [pkg] = await db.select().from(premiumPackages).where(eq(premiumPackages.id, id));
    return pkg;
  }
}

export const storage = new DatabaseStorage();
