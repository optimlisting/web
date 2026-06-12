"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@optim/ui/components/button";
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
import { Spinner } from "@optim/ui/lib/loading";
import { getMarketplaceColor } from "@/lib/utils";
import { CopyButton } from "../components/copy-button";
import {
  Search,
  Trash2,
  Eye,
  Star,
  Check,
  Sparkles,
  TrendingUp,
  List,
  Globe2,
  ChevronDown,
  Tag
} from "lucide-react";

interface ImprovementBreakdown {
  label: string;
  before: string;
  after: string;
  good: boolean;
}

interface Listing {
  id: string;
  marketplace: string;
  originalTitle: string;
  optimizedTitle: string;
  originalDescription: string;
  optimizedDescription: string;
  originalTags: string[] | null;
  optimizedTags: string[];
  seoScore: number;
  improvements: string[];
  improvementBreakdown?: ImprovementBreakdown[];
  createdAt: string;
}

interface Stats {
  total: number;
  thisMonth: number;
  avgSeoScore: number;
  byMarketplace: Array<{ marketplace: string; count: number }>;
}

const PLATFORMS = ["All Platforms", "Amazon", "Etsy", "eBay", "Shopify"];

function ScoreStars({ score }: { score: number }) {
  const stars = Math.round((score / 100) * 5);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={12} fill={i <= stars ? "#F59E0B" : "transparent"} stroke={i <= stars ? "none" : "#4B5568"} />
        ))}
      </div>
      <span style={{ color: "#EEF2FF", fontSize: "0.82rem", fontWeight: 600 }}>{score}</span>
    </div>
  );
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
  const [marketplace, setMarketplace] = useState<string>("All Platforms");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showDrop, setShowDrop] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.originalTitle.toLowerCase().includes(search.toLowerCase()) ||
      l.optimizedTitle.toLowerCase().includes(search.toLowerCase());
    const matchesMarketplace =
      marketplace === "All Platforms" || l.marketplace === marketplace.toLowerCase();
    return matchesSearch && matchesMarketplace;
  });

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

  const statsCards = [
    { label: "Total", value: stats.total, icon: List, color: "#A78BFA" },
    { label: "This Month", value: stats.thisMonth, icon: TrendingUp, color: "#00E5A0" },
    { label: "Avg SEO Score", value: stats.avgSeoScore, icon: Star, color: "#F59E0B" },
    { label: "Platforms", value: stats.byMarketplace.length, icon: Globe2, color: "#60A5FA" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bricolage font-extrabold text-3xl text-foreground leading-[1.1]">Your Listings</h1>
        <p className="text-[0.92rem] text-muted-foreground mt-1">
          View and manage your optimized listings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((item, i) => {
          const Icon = item.icon
          return (
            <Card key={i}>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color: item.color }} />
                  <span className="text-sm text-muted-foreground text-[0.78rem] font-medium">{item.label}</span>
                </div>
                <p className="font-bricolage font-extrabold text-[1.8rem] text-foreground" style={{ lineHeight: 1 }}>
                  {item.value}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#8899BB" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#EEF2FF",
              fontSize: "0.88rem",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.5)")}
            onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDrop(!showDrop)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-150 whitespace-nowrap"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: showDrop ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.09)",
              color: "#EEF2FF",
              fontSize: "0.88rem",
              fontWeight: 500,
            }}
          >
            {marketplace}
            <ChevronDown size={14} style={{ color: "#8899BB", transform: showDrop ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
          </button>
          {showDrop && (
            <div
              className="absolute top-full mt-1 right-0 w-44 rounded-xl border overflow-hidden z-20"
              style={{ background: "#0D1327", borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}
            >
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => { setMarketplace(p); setShowDrop(false); }}
                  className="w-full text-left px-4 py-2.5 transition-colors duration-100"
                  style={{
                    color: p === marketplace ? "#A78BFA" : "#C4D0F0",
                    background: p === marketplace ? "rgba(124,58,237,0.12)" : "transparent",
                    fontSize: "0.88rem",
                    fontWeight: p === marketplace ? 600 : 400,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Card className="pt-0">
        <CardContent>
          {filteredListings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {["Listing", "Platform", "SEO Score", "Date", "Actions"].map((col) => (
                    <TableHead key={col} className="text-[#8899BB] text-[0.78rem] font-semibold uppercase" 
                      style={{ letterSpacing: "0.06em" }}>
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    {/* Title */}
                    <TableCell className="py-5">
                      <div>
                        <p className="font-medium text-foreground text-[0.88rem] truncate max-w-xl">
                          {listing.optimizedTitle}
                        </p>
                        <p className="text-[0.78rem] text-[#8899BB] truncate max-w-xs mt-[0.2rem]">
                          {listing.originalTitle}
                        </p>
                      </div>
                    </TableCell>

                    {/* Platform */}
                    <TableCell>
                      <Badge
                        className="capitalize text-xs font-semibold"
                        style={{
                          background: `${getMarketplaceColor(listing.marketplace)}18`,
                          color: getMarketplaceColor(listing.marketplace),
                          border: `1px solid ${getMarketplaceColor(listing.marketplace)}30`,
                        }}
                      >
                        {listing.marketplace}
                      </Badge>
                    </TableCell>

                    {/* Score */}
                    <TableCell>
                      <ScoreStars score={listing.seoScore} />
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-[0.82rem] text-muted-foreground">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setSelectedListing(listing)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group p-1.5"
                          onClick={() => handleDelete(listing.id)}
                          disabled={deletingId === listing.id}
                        >
                          {deletingId === listing.id ? (
                            <Spinner className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (stats.total > 0 && filteredListings.length === 0) ? (
            <div className="py-16 text-center">
              <p style={{ color: "#8899BB", fontSize: "0.9rem" }}>No listings found.</p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-foreground mx-auto mb-4" />
              <p className="text-foreground">No listings yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
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
                <DialogTitle className="font-bricolage">Listing Details</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="optimized" orientation="vertical" className="flex-col mt-4">
                <TabsList className="bg-muted-foreground/18">
                  {["Optimized", "Original", "Improvements"].map((item,i) => (
                    <TabsTrigger
                      key={i}
                      value={item.toLowerCase()}
                      className="px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground"
                    >
                      {item}
                    </TabsTrigger>  
                  ))}
                </TabsList>

                <TabsContent value="optimized" className="space-y-6 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-0">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Optimized Title
                      </span>
                      <CopyButton text={selectedListing.optimizedTitle} />
                    </div>
                    <div
                      className="p-4 pl-0"
                      style={{ color: "#C4D0F0", fontSize: "0.88rem", lineHeight: 1.6 }}
                    >
                      {selectedListing.optimizedTitle}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <Tag size={11} className="inline mr-1" />
                        Optimized Tags ({selectedListing.optimizedTags.length})
                      </span>
                      <CopyButton text={selectedListing.optimizedTags.join(", ")} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedListing.optimizedTags.map((tag, i) => (
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

                  <div>
                    <div className="flex items-center justify-between mb-0">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Optimized Description
                      </span>
                      <CopyButton text={selectedListing.optimizedDescription} />
                    </div>
                    <div
                      className="p-4 pl-0"
                      style={{ color: "#C4D0F0", fontSize: "0.88rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                    >
                      {selectedListing.optimizedDescription}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="original" className="space-y-4 mt-4">
                  <div>
                    <div className="flex items-center justify-between mb-0">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Original Title
                      </span>
                    </div>
                    <div
                      className="p-4 pl-0"
                      style={{ color: "#C4D0F0", fontSize: "0.88rem", lineHeight: 1.6 }}
                    >
                      {selectedListing.originalTitle}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Original Tags ({selectedListing.originalTags?.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedListing.originalTags?.length === 0 ? (
                        <span style={{ color: "#C4D0F0", fontSize: "0.88rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>No Tags</span>
                      ) :(
                        <>
                          {selectedListing.optimizedTags.map((tag, i) => (
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
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0">
                      <span style={{ color: "#8899BB", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Original Description
                      </span>
                    </div>
                    <div
                      className="p-4 pl-0"
                      style={{ color: "#C4D0F0", fontSize: "0.88rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}
                    >
                      {selectedListing.originalDescription ?? "No Description"}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="improvements" className="mt-4">
                  <div className="grid grid-cols-2 gap-4 max-w-lg mb-4">
                    {selectedListing.improvementBreakdown?.map((imp, i) => (
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
                  <ul>
                    {selectedListing.improvements.map((improvement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#C4D0F0] p-2 pl-0"
                      >
                        <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
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
