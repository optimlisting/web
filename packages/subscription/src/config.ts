export interface PlanConfig {
  name: string;
  price: number;
  optimizationsPerMonth: number; // -1 = unlimited
  platforms: number; // -1 = all
  allowedPlatforms: string[];
  features: readonly string[];
}

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    optimizationsPerMonth: 3,
    platforms: 1,
    allowedPlatforms: [],
    features: [
      "3 listing optimizations",
      "1 platform (Etsy, eBay, or Amazon)",
      "Basic AI optimization",
    ],
  },
  STARTER: {
    name: "Starter",
    price: 9,
    optimizationsPerMonth: 15,
    platforms: 1,
    allowedPlatforms: ["etsy"],
    features: [
      "15 listing optimizations",
      "1 platform of choice",
      "Advanced AI optimization",
      "Bulk processing",
      "Connect your store",
    ],
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 29,
    optimizationsPerMonth: -1,
    platforms: -1,
    allowedPlatforms: ["etsy", "ebay", "amazon"],
    features: [
      "Unlimited optimizations",
      "All platforms (Etsy, eBay, Amazon)",
      "Priority AI processing",
      "CSV bulk import",
      "Store integration",
      "eBay & Amazon (coming soon)",
    ],
  },
} as const satisfies Record<string, PlanConfig>;

export type PlanKey = keyof typeof PLANS;

export const ALL_PLATFORMS = ["etsy", "ebay", "amazon"] as const;
export type Platform = (typeof ALL_PLATFORMS)[number];
