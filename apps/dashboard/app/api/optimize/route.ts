import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { optimizeListing, ListingInput } from "@optimlisting/ai";
import { getUsageLimit, trackUsage } from "@optim/subscription";
import { checkPlatformAccess } from "@optim/subscription/src/platform-guard";
import { createListing } from "@optimlisting/db/listing-service";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id!;

  try {
    const body = await request.json();
    const { title, description, tags, marketplace } = body;

    const platformCheck = await checkPlatformAccess(userId, marketplace);
  
    if (!platformCheck.allowed) {
      return NextResponse.json(
        { error: platformCheck.error },
        { status: 403 }
      );
    }

    if (!title || !description || !marketplace) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, marketplace" },
        { status: 400 }
      );
    }

    // Check usage limits
    const usage = await getUsageLimit(userId);

    if (!usage.isUnlimited && usage.used >= usage.limit) {
      return NextResponse.json(
        {
          error: "Usage limit reached",
          usage: {
            used: usage.used,
            limit: usage.limit,
            plan: usage.plan,
          },
          upgradeUrl: "/pricing",
        },
        { status: 429 }
      );
    }

    const input: ListingInput = {
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      marketplace,
    };

    const result = await optimizeListing(input);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Optimization failed" },
        { status: 500 }
      );
    }

    // Track usage
    await trackUsage(userId, result.tokensUsed || 0);

    // Save the listing to database
    const saved = await createListing({
      userId,
      marketplace,
      originalTitle: title,
      originalDescription: description,
      originalTags: Array.isArray(tags) ? tags : [],
      optimizedTitle: result.data!.title,
      optimizedDescription: result.data!.description,
      optimizedTags: result.data!.tags,
      seoScore: result.data!.seoScore,
      improvements: result.data!.improvements,
      tokensUsed: result.tokensUsed || 0,
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      id: saved.id,
      tokensUsed: result.tokensUsed,
      usage: {
        used: usage.used + 1,
        limit: usage.limit,
        remaining: usage.isUnlimited
          ? "Unlimited"
          : usage.limit - usage.used - 1,
        plan: usage.plan,
      },
    });
  } catch (error) {
    console.error("[Optimize API] Unhandled error:", error);
    return NextResponse.json(
      { error: "Failed to optimize listing" },
      { status: 500 }
    );
  }
}
