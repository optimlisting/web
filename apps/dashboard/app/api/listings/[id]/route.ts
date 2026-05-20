import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { getListingById } from "@optimlisting/db/listing-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const listing = await getListingById(id, session.user.id!);

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(listing);
}
