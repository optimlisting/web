import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { getListingsByUser, deleteListing } from "@optimlisting/db/listing-service";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");
  const marketplace = searchParams.get("marketplace") || undefined;

  const result = await getListingsByUser(session.user.id!, {
    limit,
    offset,
    marketplace,
  });

  return NextResponse.json(result);
}

export async function DELETE(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
  }

  await deleteListing(id, session.user.id!);

  return NextResponse.json({ success: true });
}
