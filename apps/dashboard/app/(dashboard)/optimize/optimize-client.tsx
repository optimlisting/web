"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@optim/ui/components/button";
import { Input } from "@optim/ui/components/input";
import { Textarea } from "@optim/ui/components/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@optim/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@optim/ui/components/form";
import { ErrorState } from "@optim/ui/lib/error-state";
import { EmptyState } from "@optim/ui/lib/empty-state";
import { Spinner, LoadingDots } from "@optim/ui/lib/loading";
import { CopyButton } from "../components/copy-button";
import { Sparkles, Star, AlertTriangle, Settings, TrendingUp, Tag } from "lucide-react";

const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  tags: z.string().optional(),
  marketplace: z.enum(["etsy", "ebay", "amazon"]),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface ImprovementBreakdown {
  label: string;
  before: string;
  after: string;
  good: boolean;
}

interface OptimizationData {
  title: string;
  description: string;
  tags: string[];
  seoScore: number;
  improvements: string[];
  improvementBreakdown?: ImprovementBreakdown[];
}

const PLATFORM_OPTIONS = [
  { value: "shopify", label: "Shopify" },
  { value: "etsy", label: "Etsy" },
  { value: "ebay", label: "eBay" },
  { value: "amazon", label: "Amazon" },
];

export function OptimizeClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [platformChecked, setPlatformChecked] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      marketplace: "etsy",
    },
  });

  const onSubmit = async (data: ListingFormData) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/dashboard/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          description: data.description ?? "",
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        }),
      });

      const result = await response.json();

      if (response.status === 429) {
        toast.error("Usage limit reached", {
          description: `You've used ${result.usage.used}/${result.usage.limit} optimizations this month. Upgrade your plan for more.`,
          action: {
            label: "Upgrade",
            onClick: () => (window.location.href = "/settings"),
          },
        });
        setError("Usage limit reached. Please upgrade your plan.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || "Optimization failed");
      }

      setResult(result.data);
      toast.success("Listing optimized!", {
        description: `SEO score: ${result.data.seoScore}/100`,
      });

      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect to optimization service";
      setError(message);
      toast.error("Optimization failed", {
        description: message,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    async function check() {
      try {
        const [platformRes, usageRes] = await Promise.all([
          fetch("/dashboard/api/settings/platform"),
          fetch("/dashboard/api/usage"),
        ]);
        const platformData = await platformRes.json();
        const usageData = await usageRes.json();

        setSelectedPlatform(platformData.platform);
        setIsPro(usageData.plan === "PROFESSIONAL");

        if (platformData.platform) {
          form.setValue("marketplace", platformData.platform);
        }
      } catch {
        // Ignore
      }
      setPlatformChecked(true);
    }
    check();
  }, []);

  if (!platformChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingDots className="bg-muted-foreground" />
      </div>
    );
  }

  // Gate: no platform selected and not Pro
  if (!selectedPlatform && !isPro) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-bricolage font-extrabold text-3xl text-foreground">Optimize Listing</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Settings}
              title="Select Your Platform First"
              description="Before optimizing listings, go to Settings and choose which marketplace you sell on. This only takes a moment."
              action={{
                label: "Go to Settings",
                href: "/settings#platform-selection",
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bricolage font-extrabold text-3xl text-foreground leading-[1.1]">Optimize Listing</h1>
        <p className="text-[0.92rem] text-muted-foreground mt-1">
          Paste your listing content and let AI optimize it for maximum visibility and sales.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-[rgba(13,19,39,0.7)] border-[rgba(255,255,255,0.07)] space-y-4">
          <CardHeader>
            <CardTitle className="font-bricolage font-bold text-foreground text-lg">Your Listing</CardTitle>
          </CardHeader>
          <CardContent>
            {error && !result && (
              <div className="mb-5 p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="marketplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-muted-foreground text-[0.78rem] uppercase leading-[0.06em] mb-4"
                        style={{ letterSpacing: "0.06em" }}>
                        Platform
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border border-[rgba(255,255,255,0.09)] bg-[rgba(255,255,255,0.04)] rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed border transition-all duration-150"
                          disabled={loading || (!!selectedPlatform && !isPro)}
                        >
                          {PLATFORM_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={!!selectedPlatform && !isPro && option.value !== selectedPlatform}
                            >
                              {option.label}
                              {!!selectedPlatform && !isPro ? " (locked)" : ""}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-muted-foreground text-[0.78rem] uppercase leading-[0.06em] mb-4"
                        style={{ letterSpacing: "0.06em" }}>
                        Current Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="px-4 py-5 text-foreground bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.09)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.09)] disabled:opacity-50"
                          placeholder="Handmade Ceramic Vase Blue"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-muted-foreground text-[0.78rem] uppercase leading-[0.06em] mb-4"
                        style={{ letterSpacing: "0.06em" }}>
                        Current Tags <span className="lowercase" style={{ letterSpacing: "" }}>(comma-separated)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="px-4 py-5 text-foreground bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.09)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.09)] disabled:opacity-50"
                          placeholder="vase, ceramic, blue, home decor"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-muted-foreground text-[0.78rem] uppercase leading-[0.06em] mb-4"
                        style={{ letterSpacing: "0.06em" }}>
                        Current Description <span className="lowercase" style={{ letterSpacing: "" }}>(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="px-4 text-foreground bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.09)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,255,255,0.09)] focus:border-[rgba(255,255,255,0.09)] disabled:opacity-50"
                          placeholder="Describe your product..."
                          rows={10}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full flex items-center justify-center py-6 rounded-xl transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                    color: "#fff",
                    fontWeight: 700,
                    boxShadow: "0 0 24px rgba(124,58,237,0.35)",
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Optimize Listing
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {loading && (
            <Card className="h-full">
              <CardContent className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <Sparkles size={26} style={{ color: "#A78BFA" }} className="animate-pulse" />
                </div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: "#EEF2FF", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  AI is Optimizing...
                </h3>
                <p style={{ color: "#8899BB", fontSize: "0.85rem" }}>Analyzing top-ranked listings in your category</p>
                <div className="flex gap-1.5 mt-5">
                  {[0,1,2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: "#7C3AED",
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.2);opacity:1} }`}</style>
              </CardContent>
            </Card>
          )}

          {error && !result && !loading && (
            <Card className="h-full">
              <ErrorState
                title="Optimization Failed"
                message={error}
                onRetry={() => {
                  setError(null);
                  form.handleSubmit(onSubmit)();
                }}
              />
            </Card>
          )}

          {!loading && !error && !result && (
            <Card className="h-full">
              <CardContent className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}
                >
                  <Sparkles size={26} style={{ color: "#7C3AED", opacity: 0.6 }} />
                </div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: "#EEF2FF", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  Ready to Optimize
                </h3>
                <p style={{ color: "#8899BB", fontSize: "0.88rem", lineHeight: 1.65, maxWidth: "280px" }}>
                  Fill in your listing details on the left and click optimize. Your AI-enhanced results will appear here.
                </p>
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              <Card className="flex flex-col h-full overflow-auto py-0">
                {/* Score header */}
                <div
                  className="flex items-center justify-between px-6 py-4 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,229,160,0.04)" }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} style={{ color: "#00E5A0" }} />
                    <span style={{ color: "#00E5A0", fontSize: "0.85rem", fontWeight: 700 }}>Optimization Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} fill="#F59E0B" stroke="none" />
                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, color: "#EEF2FF", fontSize: "1.1rem" }}>{result.seoScore}</span>
                    <span style={{ color: "#8899BB", fontSize: "0.8rem" }}>SEO score</span>
                  </div>
                </div>

                <div className="p-6 space-y-5 flex-1">
                  {/* Improvements row */}
                  <div className="grid grid-cols-2 gap-2">
                    {result.improvementBreakdown?.map((imp, i) => (
                      <div key={i} className="px-3 py-2.5 rounded-xl border" style={{ background: "rgba(0,229,160,0.05)", borderColor: "rgba(0,229,160,0.15)" }}>
                        <div style={{ color: "#8899BB", fontSize: "0.72rem", marginBottom: "0.2rem" }}>{imp.label}</div>
                        <div className="flex items-center gap-1.5">
                          <span style={{ color: "#ef4444", fontSize: "0.75rem", textDecoration: "line-through" }}>{imp.before}</span>
                          <span style={{ color: "#8899BB", fontSize: "0.7rem" }}>→</span>
                          <span style={{ color: "#00E5A0", fontSize: "0.75rem", fontWeight: 600 }}>{imp.after}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Optimized Title */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Optimized Title</span>
                      <CopyButton text={result.title} />
                    </div>
                    <div
                      className="p-4 rounded-xl border"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", color: "#EEF2FF", fontSize: "0.9rem", lineHeight: 1.6 }}
                    >
                      {result.title}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <Tag size={11} className="inline mr-1" />
                        Optimized Tags ({result.tags.length})
                      </span>
                      <CopyButton text={result.tags.join(", ")} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg border"
                          style={{
                            background: "rgba(124,58,237,0.1)",
                            borderColor: "rgba(124,58,237,0.2)",
                            color: "#A78BFA",
                            fontSize: "0.78rem",
                            fontWeight: 500,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Optimized Description</span>
                      <CopyButton text={result.description} />
                    </div>
                    <div
                      className="p-4 rounded-xl border"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", color: "#C4D0F0", fontSize: "0.88rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                    >
                      {result.description}
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
