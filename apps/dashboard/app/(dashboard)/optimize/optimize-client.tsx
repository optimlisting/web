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
import { Spinner } from "@optim/ui/lib/loading";
import { Sparkles, Copy, Check, ArrowRight, Star, AlertTriangle, Settings } from "lucide-react";

const listingSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  tags: z.string().optional(),
  marketplace: z.enum(["etsy", "ebay", "amazon"]),
});

type ListingFormData = z.infer<typeof listingSchema>;

interface OptimizationData {
  title: string;
  description: string;
  tags: string[];
  seoScore: number;
  improvements: string[];
}

const PLATFORM_OPTIONS = [
  { value: "etsy", label: "Etsy" },
  { value: "ebay", label: "eBay" },
  { value: "amazon", label: "Amazon" },
];

export function OptimizeClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
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
        <Spinner className="w-8 h-8 text-brand-600" />
      </div>
    );
  }

  // Gate: no platform selected and not Pro
  if (!selectedPlatform && !isPro) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Optimize Listing</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Optimize Listing</h1>
        <p className="text-sm text-gray-600 mt-1">
          Paste your listing content and let AI optimize it for maximum visibility and sales.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Listing</CardTitle>
          </CardHeader>
          <CardContent>
            {error && !result && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <FormLabel>Current Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
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
                      <FormLabel>Current Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
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
                      <FormLabel>Current Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your product..."
                          rows={6}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
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
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                  <Spinner className="w-6 h-6 text-brand-600" />
                </div>
                <p className="text-gray-600 font-medium">AI is optimizing your listing...</p>
                <p className="text-sm text-gray-500 mt-1">This usually takes a few seconds</p>
              </CardContent>
            </Card>
          )}

          {error && !result && !loading && (
            <ErrorState
              title="Optimization Failed"
              message={error}
              onRetry={() => {
                setError(null);
                form.handleSubmit(onSubmit)();
              }}
            />
          )}

          {!loading && !error && !result && (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={Sparkles}
                  title="Ready to Optimize"
                  description="Fill in your listing details on the left and click optimize. Your results will appear here."
                />
              </CardContent>
            </Card>
          )}

          {result && (
            <>
              {/* SEO Score */}
              <Card className="bg-gradient-to-r from-brand-50 to-blue-50 border-brand-100">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">SEO Score</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-3xl font-bold text-brand-600">
                          {result.seoScore}
                        </span>
                        <span className="text-sm text-gray-500">/100</span>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(result.seoScore / 20)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Title */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Optimized Title</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.title, "title")}
                  >
                    {copied === "title" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-900 font-medium leading-relaxed">
                    {result.title}
                  </p>
                </CardContent>
              </Card>

              {/* Optimized Tags */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Optimized Tags</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.tags.join(", "), "tags")}
                  >
                    {copied === "tags" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Description */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Optimized Description</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.description, "description")}
                  >
                    {copied === "description" ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {result.description}
                  </p>
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Improvements Made</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.improvements.map((improvement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <ArrowRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
