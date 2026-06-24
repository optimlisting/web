import { auth } from "@optim/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { authRateLimit } from "@optim/ratelimit";
import { createRateLimitMiddleware } from "@optim/ratelimit/src/middleware";

export const { GET: _GET, POST: _POST } = toNextJsHandler(auth);

const rateLimitCheck = createRateLimitMiddleware({
  limiter: authRateLimit,
  identifier: (req) => req.headers.get("x-forwarded-for") || "anonymous",
});

export async function GET(request: Request) {
  const rateLimitResponse = await rateLimitCheck(request as any);
  if (rateLimitResponse) return rateLimitResponse;
  return _GET(request);
}

export async function POST(request: Request) {
  const rateLimitResponse = await rateLimitCheck(request as any);
  if (rateLimitResponse) return rateLimitResponse;
  return _POST(request);
}
