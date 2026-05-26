"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { authClient } from "@optim/auth/src/client";
import { Button } from "@optim/ui/components/button";
import { Input } from "@optim/ui/components/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@optim/ui/components/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@optim/ui/components/form";
import { Spinner } from "@optim/ui/lib/loading";
import { ArrowLeft, Mail } from "lucide-react";

function HeaderLogo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <img src="/optim-logo.svg" alt="OptimListing" className="flex h-10 justify-self-center" />
      <span className="text-xl font-bold text-brand-600">OptimListing</span>
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <HeaderLogo />
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription>
              If an account exists with that email, we've sent a password reset link.
              The link expires in 1 hour.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/sign-in">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <HeaderLogo />
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
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
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      disabled={loading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <Link
              href="/sign-in"
              className="text-sm text-brand-600 hover:text-brand-700 transition"
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
