import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { isConnected } from "@optim/connections";
import { prisma } from "@optim/db";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connected = await isConnected(session.user.id!);

  if (connected) {
    const token = await prisma.etsyToken.findUnique({
      where: { userId: session.user.id! },
    });
    return NextResponse.json({
      connected: true,
      shopName: token?.shopName,
      shopId: token?.shopId,
    });
  }

  return NextResponse.json({ connected: false });
}
