import { Search, FileText, Tag, Globe, Lock, Rocket } from "@lucide/astro";

export const PLATFORMS = [
  { name: "Amazon", color: "#FF9900", bg: "#1a1200" },
  { name: "Shopify", color: "#95BF47", bg: "#0d1a07" },
  { name: "Etsy", color: "#F16521", bg: "#1a0d06" },
  { name: "eBay", color: "#E53238", bg: "#1a0507" },
];

export const BEFORE_AFTER = [
  {
    platform: "Etsy",
    before: "Handmade necklace silver chain womens jewelry",
    after: "Handmade Sterling Silver Layered Chain Necklace for Women – Minimalist Boho Jewelry Gift for Her, Birthday Present, Dainty Everyday Wear",
    lift: "+247%",
  },
  {
    platform: "Amazon",
    before: "Blue yoga mat non slip thick exercise",
    after: "Premium 6mm Non-Slip Yoga Mat | Thick, Eco-Friendly TPE Exercise Mat with Alignment Lines | Ideal for Hot Yoga, Pilates & Fitness | Includes Carrying Strap",
    lift: "+189%",
  },
  {
    platform: "eBay",
    before: "Vintage camera film retro old collectible",
    after: "Vintage 1970s Canon AE-1 35mm SLR Film Camera – Fully Functional, Tested | Retro Collectible | Great Gift for Film Photography Enthusiasts",
    lift: "+312%",
  },
];

export const FEATURES = [
  {
    icon: Search,
    title: "SEO-Tuned Titles",
    desc: "AI analyzes top-ranking listings in your category and rewrites your title with the exact keywords buyers search for — character-perfect for each platform.",
    accent: "#7C3AED",
  },
  {
    icon: FileText,
    title: "Persuasive Descriptions",
    desc: "Converts bland bullet points into emotionally compelling copy that speaks to your buyer's desires and handles their objections before they bounce.",
    accent: "#00E5A0",
  },
  {
    icon: Tag,
    title: "Smart Tag Generation",
    desc: "Fills every tag slot with high-traffic, low-competition keywords derived from real buyer searches — not guesswork, not filler.",
    accent: "#F59E0B",
  },
  {
    icon: Globe,
    title: "All 4 Platforms",
    desc: "One listing, four formats. OptimListing auto-adapts content to meet each marketplace's character limits, style guidelines, and algorithm rules.",
    accent: "#EC4899",
  },
  {
    icon: Lock,
    title: "Safe & Secure",
    desc: "We never modify your live listings. You review and approve every change.",
    accent: "#3B82F6",
  },
  {
    icon: Rocket,
    title: "Bulk Optimize",
    desc: "Import your entire catalog in minutes. Optimize hundreds of listings simultaneously with one click — no copy-pasting, no manual edits.",
    accent: "#00E5A0",
  },
];

export const STEPS = [
  {
    number: "01",
    title: "Paste Your Listing",
    desc: "Drop in your current title, description, or tags from your Amazon, Shopify, Etsy, or eBay store.",
    tag: "< 30 seconds",
  },
  {
    number: "02",
    title: "AI Analyzes & Rewrites",
    desc: "Our model studies the top 100 listings in your exact category, identifies the winning keyword patterns, and generates optimized copy tailored to your product and platform.",
    tag: "Instant results",
  },
  {
    number: "03",
    title: "Publish & Watch Sales Climb",
    desc: "Copy the optimized content in your relevant marketplace and see the results.",
    tag: "Results in 48h",
  },
];

export const PLANS = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: "Try it risk-free. No card required.",
    features: [
      "3 listing optimizations / month",
      "1 marketplace",
      "Basic AI optimzation",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Starter",
    monthlyPrice: 9,
    yearlyPrice: 7,
    desc: "Perfect for growing side hustles.",
    features: [
      "15 listing optimizations / month",
      "1 marketplace",
      "Advanced AI optimization",
    ],
    cta: "Get Starter",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Professional",
    monthlyPrice: 18,
    yearlyPrice: 14,
    desc: "For serious sellers and agencies.",
    features: [
      "Unlimited optimizations",
      "All 4 marketplaces",
      "Priority AI processing",
      "CSV bulk import (soon)",
    ],
    cta: "Go Professional",
    highlight: false,
  },
];

export const FAQS = [
  {
    q: "How does OptimListing actually improve my listings?",
    a: "Our AI analyzes the top 100 best-performing listings in your exact product category, identifies the keyword patterns, title structures, and description formats that drive clicks and conversions, then rewrites your content using those proven patterns — tailored to your specific product and the rules of your marketplace.",
  },
  {
    q: "Which platforms do you support?",
    a: "Amazon, Shopify, Etsy, and eBay. Each marketplace has different character limits, SEO algorithms, and buyer psychology — our AI understands these differences and generates platform-specific content for all four simultaneously.",
  },
  {
    q: "How fast will I see results?",
    a: "Most sellers see measurable changes in views and clicks within 72 hours of updating their listings. Sales velocity improvements typically show up within the first 2 weeks. Some of our sellers report doubling their revenue within 30 days.",
  },
  {
    q: "Is my product data safe?",
    a: "Yes. Your listing data is encrypted in transit and at rest. We never share your product information with third parties, and we never use your data to train AI models for other sellers. Your competitive edge stays yours.",
  },
  {
    q: "Can I optimize multiple listings at once?",
    a: "Not at the moment — but we are working hard to include the bulk optimizations feature soon.",
  }
];
