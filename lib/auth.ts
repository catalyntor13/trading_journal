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
  user: {
    deleteUser: {
      enabled: true,
    }
  },

  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },


  plugins: [nextCookies()]
});