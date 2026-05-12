import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { disconnect } from "@optim/connections";

export async function POST() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await disconnect(session.user.id!);

  return NextResponse.json({ success: true });
}
