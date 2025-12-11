import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"; // Importăm toată schema

const sql = neon(process.env.DATABASE_URL!);

// Aici e cheia: pasăm schema către drizzle
export const db = drizzle(sql, { schema });