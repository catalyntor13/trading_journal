import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { Resend } from "resend";
import { verificationEmail, resetPasswordEmail } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),


  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      try {
        await resend.emails.send({
          from: "MARS Trading <noreply@tradingmars.com>",
          to: user.email,
          subject: "Verify your email — MARS Trading Journal",
          html: verificationEmail({
            name: user.name || "Trader",
            url,
          }),
        });
        console.log("Verification email sent successfully!");
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
  },


  emailAndPassword: {
    enabled: true,

    // Rate limit: max 6 failed password attempts, then lock for 15 minutes
    maxPasswordLength: 128,
    minPasswordLength: 8,
    autoSignIn: true,

    async sendResetPassword(data) {
      try {
        await resend.emails.send({
          from: "MARS Trading <noreply@tradingmars.com>",
          to: data.user.email,
          subject: "Reset your password — MARS Trading Journal",
          html: resetPasswordEmail({
            name: data.user.name || "Trader",
            url: data.url,
          }),
        });
        console.log("Reset password email sent successfully!");
      } catch (error) {
        console.error("Error sending reset password email:", error);
      }
    },

  },

  // Rate limiting for security — prevents brute force attacks
  rateLimit: {
    window: 15 * 60, // 15 minutes window (in seconds)
    max: 6,          // Maximum 6 attempts per window
    customRules: {
      // Strict limit on sign-in attempts (brute force protection)
      "/api/auth/sign-in/email": {
        window: 15 * 60,
        max: 6,
      },
      // Strict limit on password reset requests (abuse prevention)
      "/api/auth/forget-password": {
        window: 15 * 60,
        max: 3,
      },
    },
  },

  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      plan: { type: "string" },
      mollieCustomerId: { type: "string" },
      subscriptionStatus: { type: "string" },
      subscriptionEndDate: { type: "date" },
    },
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