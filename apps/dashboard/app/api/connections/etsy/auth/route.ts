import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { getAuthorizationUrl } from "@optim/connections";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authUrl = getAuthorizationUrl();
  return NextResponse.json({ url: authUrl });
}
