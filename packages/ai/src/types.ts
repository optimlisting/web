export type Marketplace = "etsy" | "ebay" | "amazon";

export interface ListingInput {
  title: string;
  description: string;
  tags?: string[];
  category?: string;
  marketplace: Marketplace;
}

export interface OptimizedListing {
  title: string;
  description: string;
  tags: string[];
  improvements: string[];
  seoScore: number;
}

export interface OptimizationResult {
  success: boolean;
  data?: OptimizedListing;
  error?: string;
  tokensUsed?: number;
}
