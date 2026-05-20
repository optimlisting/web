import { getSession } from "@optim/auth";
import { redirect } from "next/navigation";
import { getListingsByUser, getListingStats } from "@optimListing/db/listing-service";
import { ListingsClient } from "./listings-client";

// Serialize dates for client components
function serializeListing(listing: any) {
  return {
    ...listing,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}

export default async function ListingsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const [result, stats] = await Promise.all([
    getListingsByUser(session.user.id!, { limit: 20 }),
    getListingStats(session.user.id!),
  ]);

  // Serialize listings for the client component
  const serializedListings = result.listings.map(serializeListing);

  return (
    <ListingsClient
      initialListings={serializedListings}
      initialTotal={result.total}
      stats={stats}
    />
  );
}
