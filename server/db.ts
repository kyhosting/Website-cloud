import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Suppress noisy Neon serverless idle connection termination warnings
pool.on('error', (error: any) => {
  // Neon terminates idle connections - this is normal, suppress the warning
  if (error.code === '57P01' || error.message?.includes('administrator command')) {
    // This is expected - Neon serverless idle timeout. Don't log it.
    return;
  }
  // Log actual errors
  console.error('Unexpected pool error:', error.message);
});

export const db = drizzle({ client: pool, schema });
