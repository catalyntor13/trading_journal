import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL
});

// Exportăm hook-urile direct pentru ușurință
export const { signIn, signUp, useSession, signOut, requestPasswordReset, resetPassword } = authClient;