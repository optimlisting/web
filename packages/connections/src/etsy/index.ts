// import { prisma } from "@optim/db";

// const ETSY_API_BASE = "https://openapi.etsy.com/v3";
// const ETSY_AUTH_BASE = "https://www.etsy.com/oauth";
// const ETSY_TOKEN_URL = "https://api.etsy.com/v3/public/oauth/token";

// interface EtsyTokens {
//   access_token: string;
//   refresh_token: string;
//   token_type: string;
//   expires_in: number;
// }

// interface EtsyListing {
//   listing_id: number;
//   title: string;
//   description: string;
//   price: { amount: number; divisor: number; currency_code: string };
//   tags: string[];
//   state: string;
//   url: string;
//   images: { url_fullxfull: string }[];
// }

// // Build the Etsy OAuth authorization URL
// export function getAuthorizationUrl(): string {
//   const clientId = process.env.ETSY_CLIENT_ID!;
//   const redirectUri = process.env.ETSY_REDIRECT_URI!;
//   const scopes = "listings_r shops_r";

//   const params = new URLSearchParams({
//     response_type: "code",
//     client_id: clientId,
//     redirect_uri: redirectUri,
//     scope: scopes,
//     state: crypto.randomUUID(),
//   });

//   return `${ETSY_AUTH_BASE}/connect?${params.toString()}`;
// }

// // Exchange authorization code for tokens
// export async function exchangeCodeForTokens(code: string): Promise<EtsyTokens> {
//   const clientId = process.env.ETSY_CLIENT_ID!;
//   const redirectUri = process.env.ETSY_REDIRECT_URI!;

//   const response = await fetch(ETSY_TOKEN_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: new URLSearchParams({
//       grant_type: "authorization_code",
//       client_id: clientId,
//       redirect_uri: redirectUri,
//       code,
//       code_verifier: process.env.ETSY_CODE_VERIFIER!,
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(`Etsy token exchange failed: ${error}`);
//   }

//   return response.json();
// }

// // Refresh an expired access token
// async function refreshToken(userId: string, refreshToken: string): Promise<string> {
//   const response = await fetch(ETSY_TOKEN_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: new URLSearchParams({
//       grant_type: "refresh_token",
//       client_id: process.env.ETSY_CLIENT_ID!,
//       refresh_token: refreshToken,
//     }),
//   });

//   if (!response.ok) {
//     // Token is unrecoverable — delete from DB
//     await prisma.etsyToken.delete({ where: { userId } }).catch(() => {});
//     throw new Error("Failed to refresh Etsy token");
//   }

//   const data: EtsyTokens = await response.json();

//   // Update stored tokens
//   await prisma.etsyToken.update({
//     where: { userId },
//     data: {
//       accessToken: data.access_token,
//       refreshToken: data.refresh_token,
//       expiresAt: new Date(Date.now() + data.expires_in * 1000),
//     },
//   });

//   return data.access_token;
// }

// // Get a valid access token (refreshing if needed)
// export async function getValidToken(userId: string): Promise<string | null> {
//   const token = await prisma.etsyToken.findUnique({ where: { userId } });

//   if (!token) return null;

//   // If token expires within 5 minutes, refresh it
//   if (token.expiresAt.getTime() - Date.now() < 300_000) {
//     return refreshToken(userId, token.refreshToken);
//   }

//   return token.accessToken;
// }

// // Save tokens after OAuth flow
// export async function saveTokens(
//   userId: string,
//   tokens: EtsyTokens
// ): Promise<void> {
//   await prisma.etsyToken.upsert({
//     where: { userId },
//     update: {
//       accessToken: tokens.access_token,
//       refreshToken: tokens.refresh_token,
//       tokenType: tokens.token_type,
//       expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
//     },
//     create: {
//       userId,
//       accessToken: tokens.access_token,
//       refreshToken: tokens.refresh_token,
//       tokenType: tokens.token_type,
//       expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
//     },
//   });
// }

// // Fetch shop ID and name after connection
// export async function fetchShopInfo(userId: string): Promise<void> {
//   const accessToken = await getValidToken(userId);
//   if (!accessToken) return;

//   const response = await fetch(
//     `${ETSY_API_BASE}/application/shops`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "x-api-key": process.env.ETSY_CLIENT_ID!,
//       },
//     }
//   );

//   if (!response.ok) return;

//   const data = await response.json();
//   const shop = data.shops?.[0];

//   if (shop) {
//     await prisma.etsyToken.update({
//       where: { userId },
//       data: {
//         shopId: String(shop.shop_id),
//         shopName: shop.shop_name,
//       },
//     });
//   }
// }

// // Get all active listings for a user
// export async function getListings(
//   userId: string,
//   options?: { limit?: number; offset?: number }
// ): Promise<EtsyListing[]> {
//   const accessToken = await getValidToken(userId);
//   if (!accessToken) throw new Error("Not connected to Etsy");

//   const token = await prisma.etsyToken.findUnique({ where: { userId } });
//   if (!token?.shopId) throw new Error("No shop found");

//   const limit = options?.limit || 100;
//   const offset = options?.offset || 0;

//   const response = await fetch(
//     `${ETSY_API_BASE}/application/shops/${token.shopId}/listings/active?limit=${limit}&offset=${offset}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "x-api-key": process.env.ETSY_CLIENT_ID!,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch Etsy listings");
//   }

//   const data = await response.json();
//   return data.results || [];
// }

// // Get a single listing with full details
// export async function getListing(
//   userId: string,
//   listingId: number
// ): Promise<EtsyListing | null> {
//   const accessToken = await getValidToken(userId);
//   if (!accessToken) throw new Error("Not connected to Etsy");

//   const response = await fetch(
//     `${ETSY_API_BASE}/application/listings/${listingId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "x-api-key": process.env.ETSY_CLIENT_ID!,
//       },
//     }
//   );

//   if (!response.ok) return null;

//   return response.json();
// }

// // Check if user has an active Etsy connection
// export async function isConnected(userId: string): Promise<boolean> {
//   const token = await prisma.etsyToken.findUnique({ where: { userId } });
//   return !!token;
// }

// // Disconnect Etsy (delete tokens)
// export async function disconnect(userId: string): Promise<void> {
//   await prisma.etsyToken.delete({ where: { userId } }).catch(() => {});
// }
