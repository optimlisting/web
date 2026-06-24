import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@optim/db";
import { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } from "@optim/email";
import { headers } from "next/headers";

export const auth = betterAuth({
  basePath: "/dashboard/api/auth",
  baseURL: `${process.env.BETTER_AUTH_URL}/api/auth`,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
      const url = `${process.env.BETTER_AUTH_URL}/dashboard/reset-password?token=${token}`
      void sendPasswordResetEmail(
        user.email,
        user.name || "there",
        url
      );
    },
    revokeSessionsOnPasswordReset: true
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      const url = `${process.env.BETTER_AUTH_URL}/dashboard/api/auth/verify-email?token=${token}&callbackURL=/dashboard`
      void sendVerificationEmail(user.email, user.name || "there", url);
    },
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      redirectURI: `${process.env.BETTER_AUTH_URL}/dashboard/api/auth/callback/google`
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendWelcomeEmail(user.email, user.name).catch(console.error);
        },
      },
    },
  },
  plugins: [nextCookies()]
});

// Convenience wrapper for server-side session checks
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
