"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@optim/ui/components/button";
import { Input } from "@optim/ui/components/input";
import { Card, CardContent } from "@optim/ui/components/card";
import { Badge } from "@optim/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@optim/ui/components/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@optim/ui/components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@optim/ui/components/tabs";
// import { ErrorState } from "@optim/ui/lib/error-state";
import { Spinner } from "@optim/ui/lib/loading";
import {
  Search,
  Trash2,
  Eye,
  Star,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  List,
  PieChart,
} from "lucide-react";

interface Listing {
  id: string;
  marketplace: string;
  originalTitle: string;
  optimizedTitle: string;
  originalDescription: string;
  optimizedDescription: string;
  optimizedTags: string[];
  seoScore: number;
  improvements: string[];
  createdAt: string;
}

interface Stats {
  total: number;
  thisMonth: number;
  avgSeoScore: number;
  byMarketplace: Array<{ marketplace: string; count: number }>;
}

export function ListingsClient({
  initialListings,
  initialTotal,
  stats,
}: {
  initialListings: Listing[];
  initialTotal: number;
  stats: Stats;
}) {
  const [listings, setListings] = useState(initialListings);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState<string>("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.originalTitle.toLowerCase().includes(search.toLowerCase()) ||
      l.optimizedTitle.toLowerCase().includes(search.toLowerCase());
    const matchesMarketplace =
      marketplace === "all" || l.marketplace === marketplace;
    return matchesSearch && matchesMarketplace;
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/dashboard/api/listings?id=${id}`, { method: "DELETE" });
      
      if (!response.ok) throw new Error("Failed to delete");
      
      setListings(listings.filter((l) => l.id !== id));
      setTotal(total - 1);
      toast.success("Listing deleted");
    } catch (error) {
      toast.error("Failed to delete listing");
    }
    setDeletingId(null);
  };

  const getSeoBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getMarketplaceColor = (mp: string) => {
    switch (mp) {
      case "etsy":
        return "bg-orange-100 text-orange-800";
      case "ebay":
        return "bg-blue-100 text-blue-800";
      case "amazon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Listings</h1>
        <p className="text-sm text-gray-600 mt-1">
          View and manage your optimized listings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">This Month</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.thisMonth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Avg SEO Score</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats.avgSeoScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Platforms</span>
            </div>
            <p className="text-2xl font-bold mt-1">
              {stats.byMarketplace.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={marketplace}
          onChange={(e) => setMarketplace(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Platforms</option>
          <option value="etsy">Etsy</option>
          <option value="ebay">eBay</option>
          <option value="amazon">Amazon</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredListings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>SEO Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 text-sm truncate max-w-xs">
                          {listing.optimizedTitle}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5">
                          {listing.originalTitle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMarketplaceColor(listing.marketplace)}>
                        {listing.marketplace}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                          {listing.seoScore}
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.round(listing.seoScore / 20)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedListing(listing)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(listing.id)}
                          disabled={deletingId === listing.id}
                        >
                          {deletingId === listing.id ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No listings yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                Go to the Optimize page to create your first listing.
              </p>
              <a href="/dashboard/optimize">
                <Button className="mt-4" size="sm">
                  Start Optimizing
                </Button>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedListing}
        onOpenChange={() => setSelectedListing(null)}
      >
        <DialogContent className="min-w-5xl max-h-[80vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle>Listing Details</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="optimized" orientation="vertical" className="mt-4">
                <TabsList>
                  <TabsTrigger value="optimized">Optimized</TabsTrigger>
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="improvements">Improvements</TabsTrigger>
                </TabsList>

                <TabsContent value="optimized" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(selectedListing.optimizedTitle, "title")
                        }
                      >
                        {copied === "title" ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {selectedListing.optimizedTitle}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.optimizedTags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            selectedListing.optimizedDescription + "\n\n" + selectedListing.optimizedDescription,
                            "full"
                          )
                        }
                      >
                        {copied === "full" ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {selectedListing.optimizedDescription}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="original" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Original Title
                    </label>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-600">
                      {selectedListing.originalTitle}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Original Description
                    </label>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-600">
                      {selectedListing.originalDescription}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="improvements" className="mt-4">
                  <ul className="space-y-2">
                    {selectedListing.improvements.map((improvement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700 bg-green-50 p-3 rounded-lg"
                      >
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
