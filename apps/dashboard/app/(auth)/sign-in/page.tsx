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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@optim/ui/components/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@optim/ui/components/form";
import { LoadingDots } from "@optim/ui/lib/loading";
import { EyeOff, Eye, ArrowRight, AlertTriangle } from "lucide-react";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
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
        if (result.error.message?.includes("email not verified") || 
          result.error.message?.includes("verify")) {
          setServerError("Please verify your email before signing in. Check your inbox for the verification link.");
        } else {
          setServerError("Invalid email or password");
        }
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#070B18] font-manrope">
      {/* Background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(124,58,237,0.18) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom right, rgba(0,229,160,0.07) 0%, transparent 70%)" }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-2 justify-center mb-5">
          <img src="/dashboard/optim-logo.svg" alt="OptimListing Logo" className="size-10" />
          <span className="font-bricolage font-bold text-[1.33rem] text-foreground">
            OptimListing
          </span>
        </Link>

        {/* Card */}
        <Card
          className="rounded-2xl border px-4 py-8"
          style={{
            background: "rgba(13,19,39,0.85)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.4), 0 0 60px rgba(124,58,237,0.08)",
          }}
        >
          <CardHeader className="mb-4">
            <CardTitle className="font-bricolage font-extrabold text-[1.75rem] text-foreground leading-[1.1]">
              Welcome back
            </CardTitle>
            <CardDescription className="mt-1.5 text-muted-foreground text-[0.92rem]">
              Sign in to your OptimListing account
            </CardDescription>
          </CardHeader>

          {serverError && (
            <div className="flex items-center gap-3 bg-destructive/10 text-foreground text-sm rounded-xl p-3">
              <AlertTriangle size={14} className="text-destructive" />
              {serverError}
            </div>
          )}

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSignInSubmit)} className="space-y-4">
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#C4D0F0] text-[0.85rem] font-semibold mb-2">
                        Email address
                      </FormLabel>
                      <input
                        {...field}
                        type="email"
                        placeholder="you@example.com"
                        disabled={loading || googleLoading}
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 ring-0 focus:ring-0"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center mb-2">
                        Password
                        <Link href="/forgot-password" className="text-[#7C3AED] text-[0.82rem] font-medium">
                          Forgot password?
                        </Link>
                      </FormLabel>
                      <div className="relative">
                        <input
                          {...field}
                          type={showPass ? "text" : "password"}
                          placeholder="••••••••"
                          disabled={loading || googleLoading}
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
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2"
                          style={{ color: "#8899BB" }}
                        >
                          {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[1.01] mt-2 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.97rem",
                    boxShadow: "0 0 28px rgba(124,58,237,0.45)",
                  }}
                >
                  {loading ? (
                    <LoadingDots className="bg-foreground" />
                  ):(
                    <>Sign In <ArrowRight size={17} /></>
                  )}
                </button>
              </form>
            </Form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span style={{ color: "#8899BB", fontSize: "0.8rem" }}>or continue with</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Google OAuth stub */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border transition-all duration-200 hover:border-white/20 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.09)",
                color: "#EEF2FF",
                fontSize: "0.92rem",
                fontWeight: 500,
              }}
            >
              {googleLoading ? (
                <LoadingDots className="bg-foreground" />
              ):(
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>  
              )}
            </button>

            <p className="text-center mt-6" style={{ color: "#8899BB", fontSize: "0.88rem" }}>
              Don't have an account?{" "}
              <Link href="/signup" style={{ color: "#A78BFA", fontWeight: 600 }}>
                Sign up free
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <Card className="max-w-md w-full">
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
      </Card> */}
    </div>
  );
}
