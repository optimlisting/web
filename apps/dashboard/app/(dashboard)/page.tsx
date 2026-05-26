import { Suspense } from "react";
import { getSession } from "@optim/auth";
import { SignOutButton } from "./components/sign-out-button";
import { redirect } from "next/navigation";
import { getUsageLimit } from "@optim/subscription";
import { getListingStats } from "@optim/db/listing-service";
import { Button } from "@optim/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@optim/ui/components/card";
import { Avatar, AvatarFallback } from "@optim/ui/components/avatar";
import { Progress } from "@optim/ui/components/progress";
import { CardSkeleton } from "@optim/ui/lib/loading";
import { List, TrendingUp, Star } from "lucide-react";

async function DashboardStats({ userId }: { userId: string }) {
  const [usage, listingStats] = await Promise.all([
    getUsageLimit(userId),
    getListingStats(userId),
  ]);

  const usagePercent = usage.isUnlimited ? 0 : Math.round((usage.used / usage.limit) * 100);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimizations Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.used}
              {!usage.isUnlimited && (
                <span className="text-gray-400 text-lg"> / {usage.limit}</span>
              )}
            </div>
            {!usage.isUnlimited && (
              <Progress value={usagePercent} className="mt-3" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <List className="w-5 h-5 text-gray-400" />
              <div className="text-2xl font-bold">{listingStats.total}</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {listingStats.thisMonth} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <div className="text-2xl font-bold">{listingStats.avgSeoScore}</div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{listingStats.total > 0 ? "Across all listings" : "No listings yet"}</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const initials = session.user.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : session.user.email?.[0]?.toUpperCase() ?? "U";

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <SignOutButton />
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      }>
        <DashboardStats userId={session.user.id!} />
      </Suspense>

      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Start Optimizing
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Go to the Optimize page to improve your marketplace listings.
            </p>
            <a href="/dashboard/optimize">
              <Button>Go to Optimize →</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
