// Format as MM/DD/YYYY (US format)
export const dateFormatterUS = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

export const getMarketplaceColor = (mp: string) => {
  switch (mp) {
    case "etsy":
      return "#F16521";
    case "ebay":
      return "#E53238";
    case "amazon":
      return "#FF9900";
    case "shopify":
      return "#95BF47";
    default:
      return "";
  }
};

// Serialize dates for client components
export function serializeListing(listing: any) {
  return {
    ...listing,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

export const getSeoBadgeColor = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};
