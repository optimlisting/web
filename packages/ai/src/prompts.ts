import type { Marketplace, ListingInput } from "./types";

export function buildOptimizationPrompt(input: ListingInput): string {
  const { title, description, tags, category, marketplace } = input;

  const platformGuides: Record<Marketplace, string> = {
    etsy: `Etsy SEO Guidelines:
- Titles up to 140 characters, front-load with main keywords
- Use all 13 tag slots with multi-word phrases
- Expand listing categories fully with attributes
- Write attribute details on the listing page, especially for "Craft" and "Style" details`,
    
    ebay: `eBay SEO Guidelines:
- Titles up to 80 characters, include brand, model, size, color
- Use item specifics (custom fields) as much as possible
- Description should include keywords naturally 3-5 times
- Avoid keyword stuffing, capitalize first letter of each word`,
    
    amazon: `Amazon SEO Guidelines:
- Titles up to 200 characters (varies by category)
- Format: Brand + Model + Key Feature + Product Type
- Bullet points should highlight key benefits and features
- Backend search terms: use single words, no repeats`,

    shopify: `Shopify SEO Guidelines:
- Titles up to 70 characters, include brand + key feature
- Meta descriptions should be 150-160 characters, include call to action
- Product descriptions should be detailed with keywords naturally placed
- Use alt text on images with descriptive keywords
- Tags help with site search and collections`
  };

  return `You are an expert marketplace listing optimizer for ${marketplace.toUpperCase()}. 

${platformGuides[marketplace]}

Optimize the following listing for maximum visibility, click-through rate, and conversion.

CURRENT LISTING:
Title: ${title}
Category: ${category || "Not specified"}
Current Tags: ${tags?.join(", ") || "None"}
Description: ${description}

TASKS:
1. Rewrite the title to be SEO-optimized for ${marketplace} search algorithm
2. Rewrite the description to be compelling, keyword-rich, and benefit-focused
3. Generate exactly 13 optimized tags for Etsy (or relevant tag equivalents for other platforms)
4. Calculate a mock SEO score (0-100) based on keyword usage, length, and structure
5. List 3-5 specific improvements made
6. Create a detailed improvements breakdown array with 4 specific items, Each item must have:
   - label: A short name for the improvement which are ("Keyword Density", "Title Length", "Tag slots used", "Buyer intent match")
   - before: The original state (e.g., "Low", "22 chars", "3/13", "weak or medium or strong")
   - after: The optimized state (e.g., "High", "128 chars", "13/13", "Strong")
   - good: true if this improvement positively impacts SEO, always true

FORMAT YOUR RESPONSE EXACTLY AS JSON:
{
  "title": "optimized title here",
  "description": "optimized description here",
  "tags": ["tag1", "tag2", ...],
  "seoScore": 85,
  "improvements": [
    "Added high-volume keyword X in title",
    "Expanded description with benefit-focused copy",
    ...
  ],
  "improvementBreakdown": [
    { label: "Keyword density", before: "Low", after: "High", good: true },
    { label: "Title length", before: "22 chars", after: "128 chars", good: true },
    { label: "Tag slots used", before: "3/13", after: "8/13", good: true },
    { label: "Buyer intent match", before: "Weak", after: "Strong", good: true }
  ],
}`;
}

export function buildQuickScorePrompt(input: ListingInput): string {
  const { title, description, tags, marketplace } = input;

  const platformContext =
    marketplace === "etsy"
      ? "Etsy SEO best practices: Use all 13 tag slots, front-load titles with main keywords, fill out all attributes, use natural language in descriptions."
      : marketplace === "ebay"
      ? "eBay SEO best practices: Include brand/model/size in title, fill item specifics completely, avoid keyword stuffing."
      : "Amazon SEO best practices: Follow category-specific title format, use backend search terms, highlight key benefits in bullets.";

  return `You are an expert marketplace SEO auditor for ${marketplace.toUpperCase()}. 

${platformContext}

Audit this listing and return a JSON object with:
- "score": A number from 0-100 representing SEO quality
- "issues": An array of 2-5 specific, actionable problems (or empty if perfect)

CRITERIA:
- Title: Is it keyword-rich, properly formatted, and within platform limits?
- Tags: Are all available tag slots used with multi-word, relevant phrases?
- Description: Is it compelling, detailed, and naturally keyword-inclusive?
- Overall: Would this listing rank well and convert to sales?

TITLE: ${title}
TAGS: ${tags?.join(", ") || "None"}
DESCRIPTION (first 500 chars): ${description.substring(0, 500)}

Return ONLY valid JSON: {"score": number, "issues": ["issue1", "issue2", ...]}`;
}
