import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { prisma } from "@optim/db";
import { getListing as getEtsyListing } from "@optim/connections";
import { optimizeListing } from "@optim/ai";
import { getUsageLimit, trackUsage } from "@optim/subscription";
import { checkPlatformAccess } from "@optim/subscription/src/platform-guard";
import { createListing } from "@optim/db/listing-service";
import type { ListingInput } from "@optim/ai";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id!;

  // Check usage
  const usage = await getUsageLimit(userId);

  if (usage.plan === "FREE") {
    return NextResponse.json(
      { error: "Bulk optimization requires a paid plan" },
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
    const { listingIds } = await request.json();

    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { error: "No listings selected" },
        { status: 400 }
      );
    }

    // Check if enough credits remain
    const remaining = usage.isUnlimited ? Infinity : usage.limit - usage.used;
    if (listingIds.length > remaining) {
      return NextResponse.json(
        {
          error: `Not enough credits. You have ${remaining} remaining but selected ${listingIds.length} listings.`,
        },
        { status: 429 }
      );
    }

    const results = [];
    let totalTokens = 0;

    for (const listingId of listingIds) {
      try {
        // Fetch full listing details from Etsy
        const etsyListing = await getEtsyListing(userId, listingId);

        if (!etsyListing) {
          results.push({
            id: listingId,
            success: false,
            error: "Listing not found",
          });
          continue;
        }

        // Check if already optimized
        const existingOptimization = await prisma.listing.findFirst({
          where: {
            userId,
            marketplace: "etsy",
            originalTitle: etsyListing.title,
          },
        });

        if (existingOptimization) {
          results.push({
            id: listingId,
            success: false,
            error: "Already optimized — skipped",
            alreadyOptimized: true,
          });
          continue;
        }

        // Prepare input for AI
        const input: ListingInput = {
          title: etsyListing.title,
          description: etsyListing.description || "",
          tags: etsyListing.tags || [],
          marketplace: "etsy",
        };

        // Run AI optimization
        const optimizationResult = await optimizeListing(input);

        if (!optimizationResult.success || !optimizationResult.data) {
          results.push({
            id: listingId,
            success: false,
            error: optimizationResult.error || "Optimization failed",
          });
          continue;
        }

        // Save to database
        await createListing({
          userId,
          marketplace: "etsy",
          originalTitle: etsyListing.title,
          originalDescription: etsyListing.description || "",
          originalTags: etsyListing.tags || [],
          optimizedTitle: optimizationResult.data.title,
          optimizedDescription: optimizationResult.data.description,
          optimizedTags: optimizationResult.data.tags,
          seoScore: optimizationResult.data.seoScore,
          improvements: optimizationResult.data.improvements,
          tokensUsed: optimizationResult.tokensUsed || 0,
        });

        // Track usage
        await trackUsage(userId, optimizationResult.tokensUsed || 0);
        totalTokens += optimizationResult.tokensUsed || 0;

        results.push({
          id: listingId,
          success: true,
          title: optimizationResult.data.title,
          seoScore: optimizationResult.data.seoScore,
        });
      } catch (error) {
        results.push({
          id: listingId,
          success: false,
          error: error instanceof Error ? error.message : "Failed",
        });
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: listingIds.length,
        successful,
        failed,
        tokensUsed: totalTokens,
      },
    });
  } catch (error) {
    console.error("Bulk optimize error:", error);
    return NextResponse.json(
      { error: "Failed to optimize listings" },
      { status: 500 }
    );
  }
}
