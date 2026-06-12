export interface PlanConfig {
  name: string;
  price: number;
  optimizationsPerMonth: number; // -1 = unlimited
  platforms: number; // -1 = all
  features: readonly string[];
}

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    optimizationsPerMonth: 3,
    platforms: 1,
    features: [
      "3 listing optimizations",
      "1 platform (Etsy, eBay, Amazon or Shopify)",
      "Basic AI optimization",
    ],
  },
  STARTER: {
    name: "Starter",
    price: 9,
    optimizationsPerMonth: 15,
    platforms: 1,
    features: [
      "15 listing optimizations",
      "1 platform of choice",
      "Advanced AI optimization",
    ],
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 18,
    optimizationsPerMonth: -1,
    platforms: -1,
    features: [
      "Unlimited optimizations",
      "All platforms (Etsy, eBay, Amazon, Shopify)",
      "Priority AI processing",
      "CSV bulk import (soon)",
    ],
  },
} as const satisfies Record<string, PlanConfig>;

export type PlanKey = keyof typeof PLANS;

export const ALL_PLATFORMS = ["etsy", "ebay", "amazon", "shopify"] as const;
export type Platform = (typeof ALL_PLATFORMS)[number];
