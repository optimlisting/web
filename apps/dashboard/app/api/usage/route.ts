import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { getUsageLimit } from "@optim/subscription";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usage = await getUsageLimit(session.user.id!);

  return NextResponse.json({
    plan: usage.plan,
    used: usage.used,
    limit: usage.limit,
    isUnlimited: usage.isUnlimited,
  });
}
