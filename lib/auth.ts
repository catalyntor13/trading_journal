import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db"; // Importăm instanța definită la Pasul 1

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // Specificăm că folosim Postgres
  }),
  emailAndPassword: {
    enabled: true, // Activăm login cu email/parolă
  },

   
  plugins: [nextCookies()]
});