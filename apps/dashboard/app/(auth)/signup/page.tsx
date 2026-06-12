"use client";

import { authClient } from "@optim/auth/src/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { registerSchema, type RegisterFormData } from "@optim/auth/src/schemas";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@optim/ui/components/form";
import { LoadingDots } from "@optim/ui/lib/loading";
import { Check, Eye, EyeOff, ArrowRight, AlertTriangle } from "lucide-react";

const PERKS = [
  "3 free optimizations to start",
  "Works on Amazon, Etsy, eBay & Shopify",
  "No credit card required",
];

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setServerError(null);

    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      },{
        onSuccess() {
          router.push("/");
        }
      });

      if (result.error) {
        setServerError(result.error.message || "Registration failed");
        setLoading(false);
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const plan = searchParams.get("plan");
      if (plan === "starter" || plan === "pro") {
        window.location.href = `/dashboard/settings?upgrade=${plan}`;
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: "#070B18", fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Left panel — value prop */}
      <div
        className="hidden lg:flex flex-col justify-center px-16 w-[45%] relative"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center left, rgba(124,58,237,0.14) 0%, transparent 65%)" }}
        />
        <div className="relative z-10">
          <a href="/" className="flex items-center gap-2 mb-16">
            <img src="/dashboard/optim-logo.svg" alt="OptimListing Logo" className="size-9" />
            <span className="font-bricolage font-bold text-[1.2rem] text-foreground">
              OptimListing
            </span>
          </a>

          <h2
            className="mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "2.2rem", color: "#EEF2FF", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Turn your listings into{" "}
            <span style={{ color: "#00E5A0" }}>revenue engines.</span>
          </h2>
          <p className="mb-10" style={{ color: "#8899BB", fontSize: "1rem", lineHeight: 1.7 }}>
            Join marketplace sellers who optimized their way to more sales — in minutes, not months.
          </p>

          <ul className="space-y-4 mb-12">
            {PERKS.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,229,160,0.15)" }}
                >
                  <Check size={13} style={{ color: "#00E5A0" }} strokeWidth={3} />
                </div>
                <span style={{ color: "#C4D0F0", fontSize: "0.95rem" }}>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(0,229,160,0.07) 0%, transparent 65%)" }}
        />

        {/* Mobile logo */}
        <a href="/" className="lg:hidden flex flex-col items-center gap-2 absolute top-8 left-6">
          <img src="/dashboard/optim-logo.svg" alt="OptimListing Logo" className="size-10" />
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: "#EEF2FF" }}>OptimListing</span>
        </a>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#EEF2FF", lineHeight: 1.1 }}
            >
              Create your account
            </h1>
            <p className="mt-1.5" style={{ color: "#8899BB", fontSize: "0.92rem" }}>
              Free forever. Upgrade when you're ready.
            </p>
          </div>

          <div
            className="rounded-2xl border p-8"
            style={{
              background: "rgba(13,19,39,0.85)",
              borderColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.35), 0 0 60px rgba(124,58,237,0.07)",
            }}
          >
            {serverError && (
            <div className="flex items-center gap-3 bg-destructive/10 text-foreground text-sm rounded-xl p-3 mb-5">
              <AlertTriangle size={14} className="text-destructive" />
              {serverError}
            </div>
          )}
            {/* Google */}
            <button
              onClick={handleGoogleSignUp}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border mb-5 transition-all duration-200 hover:border-white/20 cursor-pointer"
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

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span style={{ color: "#8899BB", fontSize: "0.8rem" }}>or with email</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#C4D0F0] text-[0.85rem] font-semibold mb-2">
                        Full Name
                      </FormLabel>
                      <input
                        type="text"
                        {...field}
                        {...form.register("name")}
                        placeholder="Jane Smith"
                        disabled={loading || googleLoading}
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
                        disabled={loading || googleLoading}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#C4D0F0] text-[0.85rem] font-semibold mb-2">
                        Password
                      </FormLabel>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"}
                          {...field}
                          {...form.register("password")}
                          placeholder="Min. 8 characters"
                          disabled={loading || googleLoading}
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
                        {...form.register("confirmPassword")}
                        placeholder="••••••••"
                        disabled={loading || googleLoading}
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
                  disabled={loading || googleLoading}
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
                  ):(
                    <>Create Free Account <ArrowRight size={17} /></>
                  )}
                </button>
              </form>
            </Form>
            <p className="text-center mt-5" style={{ color: "#8899BB", fontSize: "0.82rem" }}>
              By signing up you agree to our{" "}
              <a href="/terms" style={{ color: "#A78BFA" }}>Terms</a> and{" "}
              <a href="/privacy" style={{ color: "#A78BFA" }}>Privacy Policy</a>.
            </p>
          </div>
          <p className="text-center mt-6" style={{ color: "#8899BB", fontSize: "0.88rem" }}>
            Already have an account?{" "}
            <Link href="/sign-in" style={{ color: "#A78BFA", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
