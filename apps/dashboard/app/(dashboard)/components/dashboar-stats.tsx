"use client";

import { useUsage } from "./usage-context";
import { Card, CardContent, CardHeader, CardTitle } from "@optim/ui/components/card";
import { Progress } from "@optim/ui/components/progress";
import { List, TrendingUp, Star, Zap, Infinity } from "lucide-react";

export function DashboardStats({ listingStats }: { listingStats: any }) {
  const usage = useUsage();

  if (!usage) return

  const usagePercent = usage.isUnlimited ? 0 : Math.round((usage?.used / usage?.limit) * 100);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Optimizations Used */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)" }}>
              <Zap size={15} className="text-[#A78BFA]" />
            </div>
            <CardTitle className="text-sm text-muted-foreground font-medium">Optimizations Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="font-bricolage font-extrabold text-foreground text-[2.4rem] leading-none">{usage.used}&nbsp;</span>
              <span className="inline-flex items-center text-muted-foreground text-lg">
                /&nbsp;{usage.isUnlimited ? (
                  <Infinity size={20} />
                  ) : usage?.limit }
              </span>
            </div>
            <Progress value={usage.isUnlimited ? 100 : usagePercent} className="mt-3" />
            <p className="mt-3 text-muted-foreground text-[0.75rem]">
              {usage.isUnlimited ? (
                <>Unlimited</>
              ):(
                <>{Number(usage.limit - usage.used)} remaining this month</>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Total Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,229,160,0.12)" }}>
              <List size={15} className="text-[#00E5A0]" />
            </div>
            <CardTitle className="text-sm text-muted-foreground font-medium">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="font-bricolage font-extrabold text-foreground text-[2.4rem] leading-none">{listingStats.total}</div>
            </div>
            <p className="font-bold text-[0.78rem] text-[#00E5A0] mt-3">
              <TrendingUp className="w-3 h-3 inline mr-1" />
               {listingStats.thisMonth >= 1 ? "+" : ""}{listingStats.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        {/* Avg SEO Score */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)" }}>
              <Star size={15} className="text-[#F59E0B]" />
            </div>
            <CardTitle className="text-sm text-muted-foreground font-medium">Avg SEO Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="font-bricolage font-extrabold text-foreground text-[2.4rem] leading-none">{listingStats.avgSeoScore}</div>
            </div>
            <p className="font-semibold text-[0.78rem] text-muted-foreground mt-3">{listingStats.total > 0 ? "Across all listings" : "No listings yet"}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
