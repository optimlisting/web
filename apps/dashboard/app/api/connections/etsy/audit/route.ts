import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { getListings } from "@optim/connections";
import { quickScoreListing } from "@optim/ai";
import { getUsageLimit, trackUsage } from "@optim/subscription";
import { checkPlatformAccess } from "@optim/subscription/src/platform-guard";
import { prisma } from "@optim/db";
import type { ListingInput } from "@optim/ai";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id!;

  const usage = await getUsageLimit(userId);
  if (usage.plan === "FREE") {
    return NextResponse.json(
      { error: "Store audit requires a paid plan" },
      { status: 402 }
    );
  }

  const platformCheck = await checkPlatformAccess(userId, "etsy");
  if (!platformCheck.allowed) {
    return NextResponse.json(
      { error: platformCheck.error },
      { status: 402 }
    );
  }

  try {
    const listings = await getListings(userId, { limit: 200 });

    if (listings.length === 0) {
      return NextResponse.json({
        success: true,
        listings: [],
        stats: { total: 0, good: 0, needsWork: 0, poor: 0, avgScore: 0, alreadyOptimized: 0 },
      });
    }

    // Fetch all previously optimized listings for this user (from the Etsy marketplace)
    const optimizedListings = await prisma.listing.findMany({
      where: {
        userId,
        marketplace: "etsy",
        originalTitle: { in: listings.map((l) => l.title) },
      },
      select: {
        originalTitle: true,
        seoScore: true,
        optimizedTitle: true,
        createdAt: true,
      },
    });

    // Create a map for quick lookup
    const optimizedMap = new Map(
      optimizedListings.map((o) => [o.originalTitle, o])
    );

    const auditedListings = [];
    let totalScore = 0;
    let totalTokens = 0;
    let alreadyOptimizedCount = 0;

    for (const listing of listings) {
      const existing = optimizedMap.get(listing.title);

      if (existing) {
        // Already optimized — use existing data, skip AI call
        alreadyOptimizedCount++;
        const seoScore = existing.seoScore;

        auditedListings.push({
          id: listing.listing_id,
          title: listing.title,
          optimizedTitle: existing.optimizedTitle,
          price: listing.price
            ? `${(listing.price.currency_code || "USD")} ${(
                listing.price.amount / listing.price.divisor
              ).toFixed(2)}`
            : "N/A",
          tags: listing.tags || [],
          images: (listing.images || []).length,
          seoScore,
          status: seoScore >= 70 ? "good" : seoScore >= 45 ? "needs_work" : "poor",
          issues: [],
          url: listing.url,
          alreadyOptimized: true,
          optimizedAt: existing.createdAt.toISOString(),
        });
        totalScore += seoScore;
        continue;
      }

      // Not yet optimized — run AI audit
      const input: ListingInput = {
        title: listing.title || "",
        description: listing.description || "",
        tags: listing.tags || [],
        marketplace: "etsy",
      };

      const aiAudit = await quickScoreListing(input);

      if (!aiAudit || aiAudit.score === undefined) {
        const failedTitle = listing.title?.substring(0, 60) || "Unknown listing";
        throw new Error(
          `AI audit failed for "${failedTitle}...". The AI service may be temporarily unavailable.`
        );
      }

      const seoScore = Math.max(0, Math.min(100, Math.round(aiAudit.score)));
      const issues = aiAudit.issues || [];
      totalTokens += 300; // Approximate tokens used

      totalScore += seoScore;

      auditedListings.push({
        id: listing.listing_id,
        title: listing.title,
        optimizedTitle: null,
        price: listing.price
          ? `${(listing.price.currency_code || "USD")} ${(
              listing.price.amount / listing.price.divisor
            ).toFixed(2)}`
          : "N/A",
        tags: listing.tags || [],
        images: (listing.images || []).length,
        seoScore,
        status: seoScore >= 70 ? "good" : seoScore >= 45 ? "needs_work" : "poor",
        issues,
        url: listing.url,
        alreadyOptimized: false,
        optimizedAt: null,
      });
    }

    await trackUsage(userId, totalTokens);

    auditedListings.sort((a, b) => {
      // Sort: unoptimized first (by worst score), then already-optimized
      if (a.alreadyOptimized !== b.alreadyOptimized) {
        return a.alreadyOptimized ? 1 : -1;
      }
      return a.seoScore - b.seoScore;
    });

    const good = auditedListings.filter((l) => l.status === "good").length;
    const needsWork = auditedListings.filter((l) => l.status === "needs_work").length;
    const poor = auditedListings.filter((l) => l.status === "poor").length;

    return NextResponse.json({
      success: true,
      listings: auditedListings,
      stats: {
        total: auditedListings.length,
        good,
        needsWork,
        poor,
        avgScore: Math.round(totalScore / auditedListings.length),
        alreadyOptimized: alreadyOptimizedCount,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "We couldn't complete the audit right now.";

    console.error("Audit error:", error);

    return NextResponse.json(
      {
        error: message,
        suggestion: "Please try again in a few moments. If the issue persists, contact our support team.",
      },
      { status: 500 }
    );
  }
}
