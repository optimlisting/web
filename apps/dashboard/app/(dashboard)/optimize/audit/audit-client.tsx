"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@optim/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@optim/ui/components/tabs";
import { Card, CardContent, CardFooter } from "@optim/ui/components/card";
import { Badge } from "@optim/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@optim/ui/components/table";
// import { ErrorState } from "@optim/ui/lib/error-state";
import { EmptyState } from "@optim/ui/lib/empty-state";
import { Spinner, CardSkeleton } from "@optim/ui/lib/loading";
import {
  Sparkles,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  ExternalLink,
} from "lucide-react";

interface AuditedListing {
  id: number;
  title: string;
  optimizedTitle?: string | null;
  price: string;
  tags: string[];
  images: number;
  seoScore: number;
  status: "good" | "needs_work" | "poor";
  issues: string[];
  url: string;
  alreadyOptimized: boolean;
  optimizedAt: string | null;
}

interface AuditStats {
  total: number;
  good: number;
  needsWork: number;
  poor: number;
  avgScore: number;
  alreadyOptimized: number;
}

type Platform = "etsy" | "ebay" | "amazon";

export function AuditClient() {
  const [platform, setPlatform] = useState<Platform>("etsy");
  const [accessChecked, setAccessChecked] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<{
    reason: "free_plan" | "no_platform" | null;
  }>({ reason: null });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<AuditedListing[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [error, setError] = useState<{ message: string; suggestion?: string } | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [optimizing, setOptimizing] = useState(false);
  const [filter, setFilter] = useState<"all" | "good" | "needs_work" | "poor">("all");

  const runAudit = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/dashboard/api/connections/${selectedPlatform || "etsy"}/audit`);

      const data = await response.json();

      if (!response.ok) {
        setError({
          message: data.error || "We couldn't complete the audit right now.",
          suggestion: data.suggestion || "Please try again. If the issue persists, contact our support team.",
        });
        setLoading(false);
        return;
      }

      setListings(data.listings);
      setStats(data.stats);
      toast.success(`Audited ${data.stats.total} listings`);
    } catch (err) {
      setError({
        message: "Something unexpected happened while auditing your listings.",
        suggestion: "Check your internet connection and try again. If this keeps happening, please reach out to support.",
      });
    }

    setLoading(false);
  }, [selectedPlatform]);

  useEffect(() => {
    async function init() {
      setLoading(true);

      try {
        // Step 1: Check access
        const [platformRes, usageRes] = await Promise.all([
          fetch("/dashboard/api/settings/platform"),
          fetch("/dashboard/api/usage"),
        ]);
        const platformData = await platformRes.json();
        const usageData = await usageRes.json();

        setSelectedPlatform(platformData.platform);

        // Gate checks
        if (usageData.plan === "FREE") {
          setAccessDenied({ reason: "free_plan" });
          setLoading(false);
          setAccessChecked(true);
          return;
        }

        if (usageData.plan === "STARTER" && !platformData.platform) {
          setAccessDenied({ reason: "no_platform" });
          setLoading(false);
          setAccessChecked(true);
          return;
        }

        // Step 2: Access granted — run the audit
        setAccessDenied({ reason: null });
        await runAudit();
      } catch (err) {
        setError({
          message: "Something unexpected happened.",
          suggestion: "Check your internet connection and try again.",
        });
      }

      setAccessChecked(true);
    }

    init();
  }, []);

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const selectAllNeedsWork = () => {
    const needsWorkListings = listings.filter(
      (l) => !l.alreadyOptimized && (l.status === "needs_work" || l.status === "poor")
    );
    setSelected(new Set(needsWorkListings.map((l) => l.id)));
  };

  const handleBulkOptimize = async () => {
    if (selected.size === 0) {
      toast.error("No listings selected");
      return;
    }

    setOptimizing(true);

    try {
      const response = await fetch(`/dashboard/api/connections/${platform}/bulk-optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingIds: Array.from(selected) }),
      });

      const data = await response.json();

      if (response.status === 429) {
        toast.error(data.error || "Not enough credits");
        setOptimizing(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Optimization failed");
      }

      toast.success(
        `Optimized ${data.summary.successful}/${data.summary.total} listings`
      );

      if (data.summary.failed > 0) {
        toast.error(`${data.summary.failed} listings failed to optimize`);
      }

      // Re-run audit to refresh scores
      await runAudit();
      setSelected(new Set());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk optimize failed");
    }

    setOptimizing(false);
  };

  const filteredListings = filter === "all"
    ? listings
    : listings.filter((l) => l.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Good
          </Badge>
        );
      case "needs_work":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" /> Needs Work
          </Badge>
        );
      case "poor":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" /> Poor
          </Badge>
        );
    }
  };

  // Loading
  if (!accessChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner className="w-8 h-8 text-brand-600" />
      </div>
    );
  }

  // Free plan gate
  if (accessDenied.reason === "free_plan") {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Store Audit</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Sparkles}
              title="Upgrade to Audit Your Store"
              description="Store audit is available on Starter and Professional plans. Connect your shop and get AI-powered scores for all your listings."
              action={{
                label: "Upgrade Plan",
                href: "/settings#upgrade-plans",
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Starter plan but no platform selected
  if (accessDenied.reason === "no_platform") {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Store Audit</h1>
        </div>
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Settings}
              title="Select Your Platform First"
              description="Choose your marketplace platform in Settings before running a store audit."
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
    <Tabs className="flex-col" value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
      <TabsList className="mb-6">
        <TabsTrigger className="data-[state=active]:bg-white" value="etsy">🛒 Etsy</TabsTrigger>
        <TabsTrigger className="data-[state=active]:bg-white" value="ebay" disabled>📦 eBay (Coming Soon)</TabsTrigger>
        <TabsTrigger className="data-[state=active]:bg-white" value="amazon" disabled>📊 Amazon (Coming Soon)</TabsTrigger>
      </TabsList>

      <TabsContent value={platform}>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Store Audit</h1>
              <p className="text-sm text-gray-600 mt-1">
                Scan all your Etsy listings and identify which ones need optimization.
              </p>
            </div>
            <Button onClick={runAudit} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Auditing..." : "Run Audit"}
            </Button>
          </div>

          {/* Error State */}
          {error && !loading && (
            <Card>
              <CardContent className="py-12">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Audit Failed
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{error.message}</p>
                  {error.suggestion && (
                    <p className="text-sm text-gray-500 mb-6">{error.suggestion}</p>
                  )}
                  <div className="flex items-center justify-center gap-3">
                    <Button onClick={runAudit}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="mailto:support@optimlisting.com">Contact Support</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
              <Card>
                <CardContent className="p-0">
                  <div className="animate-pulse p-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-12 border-t border-gray-100 flex items-center">
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stats + Table */}
          {!loading && !error && stats && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-gray-600">Total Listings</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-green-600">Good</p>
                    <p className="text-2xl font-bold text-green-700">{stats.good}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-yellow-600">Needs Work</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.needsWork}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-red-600">Poor</p>
                    <p className="text-2xl font-bold text-red-700">{stats.poor}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-4">
                    <p className="text-sm text-blue-600">Already Optimized</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.alreadyOptimized}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="all">All Listings</option>
                    <option value="good">Good</option>
                    <option value="needs_work">Needs Work</option>
                    <option value="poor">Poor</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={selectAllNeedsWork}>
                    Select All That Need Work
                  </Button>
                </div>

                {selected.size > 0 && (
                  <Button onClick={handleBulkOptimize} disabled={optimizing}>
                    {optimizing ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Optimize {selected.size} Selected
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelected(new Set(filteredListings.map((l) => l.id)));
                              } else {
                                setSelected(new Set());
                              }
                            }}
                            checked={
                              filteredListings.length > 0 &&
                              selected.size === filteredListings.length
                            }
                          />
                        </TableHead>
                        <TableHead>Listing</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell>
                            {listing.alreadyOptimized ? (
                              <span title="Already optimized">
                                <CheckCircle className="w-4 h-4 text-blue-400" aria-label="Already optimized" />
                              </span>
                            ) : (
                              <input
                                type="checkbox"
                                checked={selected.has(listing.id)}
                                onChange={() => toggleSelect(listing.id)}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {listing.alreadyOptimized && (
                                <span title="Already optimized">
                                  <CheckCircle className="w-4 h-4 text-blue-400" aria-label="Already optimized" />
                                </span>
                              )}
                              <div>
                                <p className="font-medium text-gray-900 text-sm truncate max-w-xs">
                                  {listing.title}
                                </p>
                                {listing.alreadyOptimized && (
                                  <p className="text-xs text-blue-600 mt-0.5">
                                    Optimized {listing.optimizedAt ? new Date(listing.optimizedAt).toLocaleDateString() : ""}
                                  </p>
                                )}
                                {!listing.alreadyOptimized && listing.issues.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {listing.issues.slice(0, 2).map((issue, i) => (
                                      <span
                                        key={i}
                                        className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded"
                                      >
                                        {issue}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <a
                                href={listing.url}
                                target="_blank"
                                rel="noopener"
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-auto"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{listing.price}</TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {listing.tags.length}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span
                                className={`font-bold text-sm ${
                                  listing.seoScore >= 70
                                    ? "text-green-600"
                                    : listing.seoScore >= 40
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {listing.seoScore}
                              </span>
                              <span className="text-xs text-gray-500">/100</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        </TableRow>
                      ))}

                      {filteredListings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <div className="py-12 text-center">
                              <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                              <p className="text-gray-600">No listings match this filter.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  {/* Etsy Disclaimer */}
                  {!loading && !error && stats && (
                    <p className="text-xs text-gray-400 text-center mt-4">
                      Listing data retrieved via the official Etsy API. The term "Etsy" is a trademark of Etsy, Inc.
                      This application is not endorsed or certified by Etsy, Inc.
                    </p>
                  )}
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
