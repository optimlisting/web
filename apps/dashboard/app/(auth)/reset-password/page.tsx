"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { Spinner, LoadingDots } from "@optim/ui/lib/loading";
import { ArrowRight, Check } from "lucide-react";

function HeaderLogo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-5">
      <img src="/dashboard/optim-logo.svg" alt="OptimListing" className="flex size-9 justify-self-center" />
      <span className="text-xl font-bricolage font-bold text-foreground">OptimListing</span>
    </div>
  )
}

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.resetPassword({
        token,
        newPassword: data.password,
      });

      if (result.error) {
        toast.error(result.error.message || "Failed to reset password");
      } else {
        setDone(true);
        toast.success("Password reset successfully");
      }
    } catch {
      toast.error("Failed to reset password");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <Card className="max-w-md w-full">
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-2xl text-foreground font-bricolage font-bold mb-2">Invalid Link</CardTitle>
          <CardDescription className="text-muted-foreground">
            This password reset link is invalid or missing. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/forgot-password" className="flex items-center gap-2 w-fit mx-auto text-sm text-foreground hover:text-muted-foreground transition">
            Request New Link <ArrowRight size={17} />
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="max-w-md w-full">
        <CardHeader className="text-center mb-2">
          <div className="w-12 h-12 rounded-full bg-transparet border border-[#00E5A0] flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-[#00E5A0]" />
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset!</CardTitle>
          <CardDescription>
            Your password has been changed. Sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/sign-in" className="flex items-center gap-2 w-fit mx-auto text-sm text-foreground hover:text-muted-foreground transition">
            Go to Sign In <ArrowRight size={17} />
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bricolage font-bold text-foreground">Reset Password</CardTitle>
        <CardDescription className="text-muted-foreground">Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C4D0F0] text-[0.85rem] font-semibold mb-2">
                    New Password
                  </FormLabel>
                  <input
                    type={"password"}
                    {...field}
                    placeholder="••••••••"
                    disabled={loading}
                    minLength={8}
                    className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all duration-200"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#C4D0F0] text-[0.85rem] font-semibold mb-2">
                    Confirm Password
                  </FormLabel>
                  <input
                    type={"password"}
                    {...field}
                    placeholder="••••••••"
                    disabled={loading}
                    minLength={8}
                    className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all duration-200"
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
                <LoadingDots className="bg-foreground" />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-manrope"
      style={{ background: "#070B18", fontFamily: "'Manrope', sans-serif" }}
    >
      <HeaderLogo />
      <Suspense
        fallback={
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center">
              <Spinner className="w-8 h-8 text-foreground mx-auto" />
            </CardContent>
          </Card>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
