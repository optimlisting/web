import { prisma } from "./index";
import type { Prisma, Listing } from "../generated/prisma/client";

export interface ImprovementBreakdown {
  label: string;
  before: string;
  after: string;
  good: boolean;
}

export interface CreateListingInput {
  userId: string;
  marketplace: string;
  originalTitle: string;
  originalDescription?: string;
  originalTags?: string[];
  optimizedTitle: string;
  optimizedDescription: string;
  optimizedTags: string[];
  seoScore: number;
  improvements: string[];
  improvementBreakdown?: ImprovementBreakdown[];
  tokensUsed?: number;
}

export async function createListing(input: CreateListingInput): Promise<Listing> {
  // Convert string[] to a JSON-compatible format for Prisma
  // Prisma stores arrays as JSON in PostgreSQL
  return prisma.listing.create({
    data: {
      userId: input.userId,
      marketplace: input.marketplace,
      originalTitle: input.originalTitle,
      originalDescription: input.originalDescription || null,
      originalTags: input.originalTags ? JSON.stringify(input.originalTags) : null,
      optimizedTitle: input.optimizedTitle,
      optimizedDescription: input.optimizedDescription,
      optimizedTags: input.optimizedTags, // Prisma handles string[] natively for this field
      seoScore: input.seoScore,
      improvements: input.improvements,
      improvementBreakdown: input.improvementBreakdown as any,
      tokensUsed: input.tokensUsed || 0,
    },
  });
}

export interface ListingWithParsedTags {
  id: string;
  userId: string;
  marketplace: string;
  originalTitle: string;
  originalDescription: string | null;
  originalTags: string[] | null;
  optimizedTitle: string;
  optimizedDescription: string;
  optimizedTags: string[];
  seoScore: number;
  improvements: string[];
  improvementBreakdown?: ImprovementBreakdown[];
  tokensUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getListingsByUser(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    marketplace?: string;
  }
) {
  const { limit = 20, offset = 0, marketplace } = options || {};

  const where: Prisma.ListingWhereInput = { userId };
  if (marketplace) {
    where.marketplace = marketplace;
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.listing.count({ where }),
  ]);

  // Parse originalTags from JSON string back to array
  const parsedListings: ListingWithParsedTags[] = listings.map((listing) => ({
    ...listing,
    originalTags: listing.originalTags
      ? typeof listing.originalTags === "string"
        ? JSON.parse(listing.originalTags)
        : listing.originalTags
      : null,
    improvementBreakdown: listing.improvementBreakdown as unknown as ImprovementBreakdown[] | undefined,
  }));

  return {
    listings: parsedListings,
    total,
    hasMore: offset + limit < total,
  };
}

export async function getListingById(id: string, userId: string) {
  const listing = await prisma.listing.findFirst({
    where: { id, userId },
  });

  if (!listing) return null;

  return {
    ...listing,
    originalTags: listing.originalTags
      ? typeof listing.originalTags === "string"
        ? JSON.parse(listing.originalTags)
        : listing.originalTags
      : null,
    improvementBreakdown: listing.improvementBreakdown as unknown as ImprovementBreakdown[] | undefined,
  } as ListingWithParsedTags;
}

export async function deleteListing(id: string, userId: string) {
  return prisma.listing.deleteMany({
    where: { id, userId },
  });
}

export async function getListingStats(userId: string) {
  const [total, thisMonth, byMarketplace, avgSeoScore] = await Promise.all([
    prisma.listing.count({ where: { userId } }),
    prisma.listing.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.listing.groupBy({
      by: ["marketplace"],
      where: { userId },
      _count: true,
    }),
    prisma.listing.aggregate({
      where: { userId },
      _avg: { seoScore: true },
    }),
  ]);

  return {
    total,
    thisMonth,
    byMarketplace: byMarketplace.map((m) => ({
      marketplace: m.marketplace,
      count: m._count,
    })),
    avgSeoScore: Math.round(avgSeoScore._avg.seoScore || 0),
  };
}
