import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const accountStatusEnum = pgEnum("account_status", ["active", "banned", "suspended"]);
export const premiumStatusEnum = pgEnum("premium_status", ["free", "premium", "expired"]);
export const botVersionEnum = pgEnum("bot_version", ["v1", "v2"]);
export const botStatusEnum = pgEnum("bot_status", ["online", "offline", "error", "idle"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "approved", "rejected"]);

// Session storage table (IMPORTANT for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
visibleId: varchar("visible_id").unique().notNull(),
  email: varchar("email").unique(),
  telegramId: varchar("telegram_id"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("user").notNull(),
  accountStatus: accountStatusEnum("account_status").default("active").notNull(),
  premiumStatus: premiumStatusEnum("premium_status").default("free").notNull(),
  premiumExpiry: timestamp("premium_expiry"),
  totalBots: integer("total_bots").default(0).notNull(),
  maxBots: integer("max_bots").default(3).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  loginAttempts: integer("login_attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bots table
export const bots = pgTable("bots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  botToken: text("bot_token").notNull(),
  botName: varchar("bot_name").notNull(),
  botUsername: varchar("bot_username"),
  version: botVersionEnum("version").default("v1").notNull(),
  status: botStatusEnum("status").default("offline").notNull(),
  cpuUsage: integer("cpu_usage").default(0),
  ramUsage: integer("ram_usage").default(0),
  ping: integer("ping").default(0),
  uptime: integer("uptime").default(0),
  lastError: text("last_error"),
  lastActiveAt: timestamp("last_active_at"),
  configPath: varchar("config_path"),
  isAdminBot: boolean("is_admin_bot").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Premium packages table
export const premiumPackages = pgTable("premium_packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  durationDays: integer("duration_days").notNull(),
  price: integer("price").notNull(),
  maxBots: integer("max_bots").notNull(),
  features: text("features").array(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  packageId: varchar("package_id").references(() => premiumPackages.id),
  amount: integer("amount").notNull(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  proofImageUrl: varchar("proof_image_url"),
  adminNote: text("admin_note"),
  processedBy: varchar("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// OTP codes table
export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  telegramId: varchar("telegram_id").notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  isUsed: boolean("is_used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security logs table
export const securityLogs = pgTable("security_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin messages table
export const adminMessages = pgTable("admin_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// System settings table
export const systemSettings = pgTable("system_settings", {
  key: varchar("key").primaryKey(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bots: many(bots),
  payments: many(payments),
  securityLogs: many(securityLogs),
  adminMessages: many(adminMessages),
}));

export const botsRelations = relations(bots, ({ one }) => ({
  user: one(users, {
    fields: [bots.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  package: one(premiumPackages, {
    fields: [payments.packageId],
    references: [premiumPackages.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBotSchema = createInsertSchema(bots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertOtpSchema = createInsertSchema(otpCodes).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertAdminMessageSchema = createInsertSchema(adminMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bot = typeof bots.$inferSelect;
export type InsertBot = z.infer<typeof insertBotSchema>;

export type PremiumPackage = typeof premiumPackages.$inferSelect;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type OtpCode = typeof otpCodes.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;

export type SecurityLog = typeof securityLogs.$inferSelect;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;

export type AdminMessage = typeof adminMessages.$inferSelect;
export type InsertAdminMessage = z.infer<typeof insertAdminMessageSchema>;
