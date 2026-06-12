export type Marketplace = "etsy" | "ebay" | "amazon" | "shopify";

export interface ListingInput {
  title: string;
  description: string;
  tags?: string[];
  category?: string;
  marketplace: Marketplace;
}

export interface ImprovementBreakdown {
  label: string;
  before: string;
  after: string;
  good: boolean;
}

export interface OptimizedListing {
  title: string;
  description: string;
  tags: string[];
  improvements: string[];
  improvementBreakdown?: ImprovementBreakdown[];
  seoScore: number;
}

export interface OptimizationResult {
  success: boolean;
  data?: OptimizedListing;
  error?: string;
  tokensUsed?: number;
}
