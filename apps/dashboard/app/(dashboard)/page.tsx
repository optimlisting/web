import Link from "next/link";
import { Suspense } from "react";
import { getSession } from "@optim/auth";
import { redirect } from "next/navigation";
import { getListingsByUser, getListingStats } from "@optim/db/listing-service";
import { Card, CardContent } from "@optim/ui/components/card";
import { DashboardStats } from "./components/dashboar-stats";
import { CardSkeleton } from "@optim/ui/lib/loading";
import { serializeListing, getMarketplaceColor, dateFormatterUS } from "@/lib/utils";
import { Star, Sparkles, Clock, ArrowRight } from "lucide-react";


export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const [result, listingStats] = await Promise.all([
      getListingsByUser(session.user.id!, { limit: 3 }),
      getListingStats(session.user.id),
    ]);
  
  // Serialize listings for the client component
  const serializedListings = result.listings.map(serializeListing);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bricolage font-extrabold text-foreground leading-[1.1]">Dashboard</h1>
          <p className="text-[0.92rem] text-muted-foreground mt-1">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/optimize"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "#fff",
              fontSize: "0.88rem",
              fontWeight: 600,
              boxShadow: "0 0 20px rgba(124,58,237,0.35)",
            }}
          >
            <Sparkles size={15} />
            New Optimization
          </Link>
        </div>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      }>
        <DashboardStats listingStats={listingStats!} />
      </Suspense>

      {/* Recent listings */}
      <div
        className="rounded-2xl border mb-6"
        style={{ background: "rgba(13,19,39,0.7)", borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, color: "#EEF2FF", fontSize: "1rem" }}>
            Recent Optimizations
          </h3>
          {serializedListings.length > 0 && (
            <Link
              href="/listings"
              className="flex items-center gap-1 transition-colors hover:text-white"
              style={{ color: "#8899BB", fontSize: "0.82rem", fontWeight: 500 }}
            >
              View all <ArrowRight size={13} />
            </Link>
          )}
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          {serializedListings.length === 0 ? (
            <div className="py-16 text-center">
              <p style={{ color: "#8899BB", fontSize: "0.9rem" }}>No optimizations found.</p>
            </div>
          ) : (
            <>
              {serializedListings.map((item, i) => {
                const color = getMarketplaceColor(item.marketplace);
                const date = dateFormatterUS.format(new Date(item.createdAt));
                return (
                  <div key={i} className="flex items-center gap-4 px-6 py-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}18` }}
                    >
                      <Sparkles size={15} style={{ color: `${color}` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: "#EEF2FF", fontSize: "0.88rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.optimizedTitle}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-semibold"
                          style={{ background: `${color}18`, color: `${color}` }}
                        >
                          {item.marketplace}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock size={11} style={{ color: "#8899BB" }} />
                          <span style={{ color: "#8899BB", fontSize: "0.75rem" }}>{date}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
                      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
                    >
                      <Star size={12} fill="#F59E0B" stroke="none" />
                      <span style={{ color: "#F59E0B", fontSize: "0.82rem", fontWeight: 700 }}>{item.seoScore}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Optimize CTA banner */}
      <Card
        className="border p-8 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(0,229,160,0.06) 100%)",
          borderColor: "rgba(124,58,237,0.25)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)" }}
        />
        <CardContent className="relative z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
          >
            <Sparkles size={22} style={{ color: "#A78BFA" }} />
          </div>
          <h3
            className="mb-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#EEF2FF" }}
          >
            Ready to Optimize?
          </h3>
          <p className="mb-5" style={{ color: "#8899BB", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Paste your listing and let AI rewrite it for maximum visibility and sales.
          </p>
          <Link
            href="/optimize"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.92rem",
              boxShadow: "0 0 24px rgba(124,58,237,0.4)",
            }}
          >
            Go to Optimize <ArrowRight size={16} />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
