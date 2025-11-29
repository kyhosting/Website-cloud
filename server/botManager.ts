/**
 * Bot Process Manager - Spawns and monitors actual bot processes
 * Handles V1 (Node.js) and V2 (Python) bot processes
 */

import { spawn, ChildProcess } from "child_process";
import path from "path";
import fs from "fs";
import { storage } from "./storage";

interface BotProcess {
  id: string;
  process: ChildProcess | null;
  status: "running" | "stopped" | "error";
  startedAt: Date | null;
  lastHeartbeat: Date | null;
  uptime: number;
  logs: string[];
  version: string;
}

class BotProcessManager {
  private processes: Map<string, BotProcess> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start heartbeat monitor every 5 seconds
    this.startHeartbeatMonitor();
  }

  /**
   * Spawn a bot process
   */
  async spawnBot(
    botId: string,
    botToken: string,
    telegramId: number,
    version: "v1" | "v2"
  ): Promise<boolean> {
    try {
      console.log(`🤖 Spawning bot ${botId} (${version})`);

      // Get bot directory
      const botDir = path.join(process.cwd(), "bots", version);
      if (!fs.existsSync(botDir)) {
        throw new Error(`Bot directory not found: ${botDir}`);
      }

      // Prepare config
      const config = {
        botToken,
        telegramId,
        botId,
        userId: "PLATFORM",
        isPremium: true,
        environment: "production",
      };

      const configJson = JSON.stringify(config);

      // Kill existing process if any
      if (this.processes.has(botId)) {
        this.stopBot(botId);
      }

      let childProcess: ChildProcess;

      if (version === "v1") {
        // Node.js bot
        childProcess = spawn("node", ["bootstrap.js"], {
          cwd: botDir,
          env: {
            ...process.env,
            BOT_CONFIG: configJson,
            NODE_ENV: "production",
            TELEGRAM_BOT_TOKEN: botToken,
            OWNER_ID: String(telegramId),
            BOT_ID: botId,
          },
          stdio: ["ignore", "pipe", "pipe"],
        });
      } else {
        // Python bot
        childProcess = spawn("python", ["bootstrap.py"], {
          cwd: botDir,
          env: {
            ...process.env,
            BOT_CONFIG: configJson,
            TELEGRAM_BOT_TOKEN: botToken,
            OWNER_ID: String(telegramId),
            BOT_ID: botId,
          },
          stdio: ["ignore", "pipe", "pipe"],
        });
      }

      const botProcess: BotProcess = {
        id: botId,
        process: childProcess,
        status: "running",
        startedAt: new Date(),
        lastHeartbeat: new Date(),
        uptime: 0,
        logs: [],
        version,
      };

      // Capture output
      childProcess.stdout?.on("data", (data) => {
        const message = data.toString().trim();
        botProcess.logs.push(`[${new Date().toISOString()}] ${message}`);
        botProcess.logs = botProcess.logs.slice(-100); // Keep last 100 logs
        console.log(`[Bot ${botId}] ${message}`);

        // Check for "connected" or "started" messages
        if (
          message.toLowerCase().includes("connected") ||
          message.toLowerCase().includes("bot started") ||
          message.toLowerCase().includes("listening")
        ) {
          botProcess.lastHeartbeat = new Date();
        }
      });

      childProcess.stderr?.on("data", (data) => {
        const message = data.toString().trim();
        botProcess.logs.push(`[ERROR] ${message}`);
        botProcess.logs = botProcess.logs.slice(-100);
        console.error(`[Bot ${botId} ERROR] ${message}`);
      });

      childProcess.on("error", (error) => {
        console.error(`[Bot ${botId}] Process error:`, error);
        botProcess.status = "error";
      });

      childProcess.on("exit", (code, signal) => {
        console.log(
          `[Bot ${botId}] Process exited with code ${code}, signal ${signal}`
        );
        botProcess.status = "stopped";
        botProcess.process = null;
      });

      this.processes.set(botId, botProcess);

      // Update database immediately
      await storage.updateBot(botId, {
        status: "online",
        uptime: 0,
        lastActiveAt: new Date(),
        lastError: null,
      });

      console.log(`✅ Bot ${botId} spawned successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to spawn bot ${botId}:`, error);
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error";

      // Update database with error
      await storage.updateBot(botId, {
        status: "error",
        lastError: errorMsg,
        lastActiveAt: new Date(),
      });

      return false;
    }
  }

  /**
   * Stop a bot process
   */
  stopBot(botId: string): void {
    const botProcess = this.processes.get(botId);
    if (botProcess && botProcess.process) {
      console.log(`🛑 Stopping bot ${botId}`);
      botProcess.process.kill("SIGTERM");
      botProcess.status = "stopped";
      botProcess.process = null;
    }
  }

  /**
   * Restart a bot process
   */
  async restartBot(
    botId: string,
    botToken: string,
    telegramId: number,
    version: "v1" | "v2"
  ): Promise<boolean> {
    this.stopBot(botId);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    return this.spawnBot(botId, botToken, telegramId, version);
  }

  /**
   * Get bot process info
   */
  getBotInfo(botId: string): BotProcess | undefined {
    return this.processes.get(botId);
  }

  /**
   * Get all active processes
   */
  getAllProcesses(): BotProcess[] {
    const values: BotProcess[] = [];
    this.processes.forEach((v) => values.push(v));
    return values;
  }

  /**
   * Heartbeat monitor - checks bot health every 5 seconds
   */
  private startHeartbeatMonitor(): void {
    this.heartbeatInterval = setInterval(async () => {
      const entries: [string, BotProcess][] = [];
      this.processes.forEach((v, k) => entries.push([k, v]));
      for (const [botId, botProcess] of entries) {
        if (botProcess.status === "running" && botProcess.process) {
          // Check if process is still alive
          if (botProcess.process.killed) {
            botProcess.status = "stopped";
            continue;
          }

          // Update uptime
          if (botProcess.startedAt) {
            botProcess.uptime = Math.floor(
              (Date.now() - botProcess.startedAt.getTime()) / 1000
            );
          }

          // Check heartbeat timeout (no activity for 30 seconds)
          if (botProcess.lastHeartbeat) {
            const timeSinceHeartbeat = Date.now() - botProcess.lastHeartbeat.getTime();
            if (timeSinceHeartbeat > 30000) {
              console.warn(
                `⚠️ Bot ${botId} heartbeat timeout (${Math.floor(timeSinceHeartbeat / 1000)}s)`
              );
              botProcess.status = "error";
              await storage.updateBot(botId, {
                status: "error",
                lastError: "Heartbeat timeout",
              });
            } else {
              // Update database with current uptime
              await storage.updateBot(botId, {
                status: "online",
                uptime: botProcess.uptime,
                lastActiveAt: new Date(),
              });
            }
          }
        } else if (botProcess.status === "stopped") {
          // Clean up stopped processes
          this.processes.delete(botId);
        }
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Get bot logs
   */
  getBotLogs(botId: string, lines: number = 50): string[] {
    const botProcess = this.processes.get(botId);
    if (!botProcess) return [];
    return botProcess.logs.slice(-lines);
  }

  /**
   * Stop all bots (for graceful shutdown)
   */
  stopAllBots(): void {
    const botIds: string[] = [];
    this.processes.forEach((_, botId) => botIds.push(botId));
    botIds.forEach((botId) => this.stopBot(botId));
  }
}

// Export singleton instance
export const botManager = new BotProcessManager();
