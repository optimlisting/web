"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { authClient } from "@optim/auth/src/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@optim/ui/components/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@optim/ui/components/form";
import { LoadingDots } from "@optim/ui/lib/loading";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

function HeaderLogo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-5">
      <img src="/dashboard/optim-logo.svg" alt="OptimListing" className="flex size-9 justify-self-center" />
      <span className="text-xl font-bricolage font-bold text-foreground">OptimListing</span>
    </div>
  )
}

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await authClient.requestPasswordReset({
        email: data.email,
      });
      setSent(true);
    } catch {
    // Always show success to prevent email enumeration
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "#070B18", fontFamily: "'Manrope', sans-serif" }}
      >
        <HeaderLogo />
        <Card className="max-w-md w-full">
          <CardHeader className="text-center mb-2">
            <div className="w-14 h-14 rounded-full bg-transparent border border-foreground flex items-center justify-center mx-auto mb-2">
              <Mail className="w-6 h-auto text-foreground" />
            </div>
            <CardTitle className="text-2xl font-bricolage font-bold text-foreground mb-2">Check Your Email</CardTitle>
            <CardDescription>
              If an account exists with that email, we've sent a password reset link.
              The link expires in 1 hour.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/sign-in" className="flex items-center w-fit mx-auto text-sm text-foreground hover:text-muted-foreground transition">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-manrope"
      style={{ background: "#070B18", fontFamily: "'Manrope', sans-serif" }}
    >
      <HeaderLogo />
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-foreground font-bricolage font-bold mb-1">Forgot your password ?</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#C4D0F0] text-[0.85rem] font-semibold mb-2">
                      Email
                    </FormLabel>
                    <input
                      type="email"
                      {...field}
                      {...form.register("email")}
                      placeholder="you@example.com"
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "#EEF2FF",
                        fontSize: "0.92rem",
                      }}
                      onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
                      onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[1.01] mt-2 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.97rem",
                  boxShadow: "0 0 28px rgba(124,58,237,0.4)",
                }}
              >
                {loading ? (
                  <>
                    <LoadingDots className="w-4 h-4 bg-foreground" />
                  </>
                ) : (
                  <>Send Reset Link <ArrowRight size={17} /></>
                )}
              </button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <Link
              href="/sign-in"
              className="text-sm text-foreground hover:text-muted-foreground transition"
            >
              <ArrowLeft className="w-3 h-3 inline mr-1" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
