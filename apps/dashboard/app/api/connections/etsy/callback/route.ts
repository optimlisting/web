import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@optim/auth";
import { exchangeCodeForTokens, saveTokens, fetchShopInfo } from "@optim/connections";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL("/settings?etsy=error", request.url)
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Save tokens
    await saveTokens(session.user.id!, tokens);

    // Fetch shop info in background (non-blocking)
    fetchShopInfo(session.user.id!).catch(console.error);

    return NextResponse.redirect(
      new URL("/settings?etsy=connected", request.url)
    );
  } catch (error) {
    console.error("Etsy callback error:", error);
    return NextResponse.redirect(
      new URL("/settings?etsy=error", request.url)
    );
  }
}
