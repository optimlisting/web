"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  type SignInFormData,
} from "@optim/auth/src/schemas";
import { authClient } from "@optim/auth/src/client";
import { Button } from "@optim/ui/components/button";
import { Input } from "@optim/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@optim/ui/components/card";
import { Separator } from "@optim/ui/components/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@optim/ui/components/form";
import { Spinner } from "@optim/ui/lib/loading";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSignInSubmit = async (data: SignInFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      },{
        onSuccess() {
          router.push("/");
        }
      });

      if (result.error) {
        setServerError("Invalid email or password");
        setLoading(false);
        return;
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <a href="/" className="flex flex-col items-center gap-2">
        <img src="/dashboard/optim-logo.svg" alt="OptimListing" className="flex h-10 justify-self-center" />
        <span className="text-xl font-bold text-brand-600">OptimListing</span>
      </a>
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Sign in
          </CardTitle>
          <CardDescription className="max-w-xs justify-self-center">
            Sign in to your account to access your dashboard and manage your listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]"></span>
                  </span>
                  Redirecting...
                </span>
              ) : (
                <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <span className="text-xs text-gray-500">OR</span>
              <Separator className="flex-1" />
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {serverError}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSignInSubmit)}
                className="space-y-4"
              >
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-brand-600 hover:text-brand-700 transition"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner className="w-4 h-4 mr-2" /> : null}
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="text-center">
              <Link href="/signup" className="text-sm text-brand-600 hover:text-brand-700 transition">
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
