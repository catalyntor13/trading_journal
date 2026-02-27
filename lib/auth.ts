import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db"; // Importăm instanța definită la Pasul 1
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // Specificăm că folosim Postgres
  }),

  emailVerification: {
    sendOnSignUp: true,
    async sendVerificationEmail({ user, url }) {
      try {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your email for MARS Trading Journal",
          html: `
                        <h2>Hello!</h2>
                        <p>You requested to verify your email. Click the link below:</p>
                        <a href="${url}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify your email</a>
                        <p>If you didn't request this, you can ignore this message.</p>
                    `,
        });
        console.log("Email has been sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    },
  },

  emailAndPassword: {
    enabled: true, // Activăm login cu email/parolă
    requireEmailVerification: true,

    async sendResetPassword(data) {
      try {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: data.user.email,
          subject: "Reset Password for MARS Trading Journal",
          html: `
                        <h2>Hello!</h2>
                        <p>You requested to reset your password. Click the link below:</p>
                        <a href="${data.url}" style="padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 5px;">Set a new password</a>
                        <p>If you didn't request this, you can ignore this message.</p>
                    `,
        });
        console.log("Email has been sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    },

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