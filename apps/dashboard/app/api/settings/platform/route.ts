import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { setSelectedPlatform, getSelectedPlatform } from "@optim/subscription/src/platform-guard";
import type { Platform } from "@optim/subscription/src/config";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const platform = await getSelectedPlatform(session.user.id!);

  return NextResponse.json({ platform });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { platform } = await request.json();

  if (!["etsy", "ebay", "amazon"].includes(platform)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  await setSelectedPlatform(session.user.id!, platform as Platform);

  return NextResponse.json({ success: true });
}
