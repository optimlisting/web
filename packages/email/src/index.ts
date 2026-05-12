import { Resend } from "resend";
import { WelcomeEmail } from "./templates/welcome";
import { ResetPasswordEmail } from "./templates/reset-password";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "OptimListing <hello@optimlisting.com>";

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.log("[EMAIL] Skipping welcome email — RESEND_API_KEY not set");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to OptimListing! 🚀",
      react: WelcomeEmail({ name }),
    });
  } catch (error) {
    console.error("[EMAIL] Failed to send welcome email:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
) {
  if (!resend) {
    console.log("[EMAIL] Skipping password reset — RESEND_API_KEY not set");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password",
      react: ResetPasswordEmail({ name, resetUrl }),
    });
  } catch (error) {
    console.error("[EMAIL] Failed to send password reset:", error);
  }
}
