import { NextResponse } from "next/server";
import { getSession } from "@optim/auth";
import { prisma } from "@optimlisting/db";

export async function POST() {
  const session = await getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Delete all user data in the correct order (respect foreign keys)
    // Usage records
    await prisma.usage.deleteMany({ where: { userId } });
    
    // Listings
    await prisma.listing.deleteMany({ where: { userId } });
    
    // Subscription
    await prisma.subscription.deleteMany({ where: { userId } });
    
    // Sessions
    await prisma.session.deleteMany({ where: { userId } });
    
    // Accounts (OAuth connections)
    await prisma.account.deleteMany({ where: { userId } });
    
    // Finally, delete the user
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." },
      { status: 500 }
    );
  }
}
