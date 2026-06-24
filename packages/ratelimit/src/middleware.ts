import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";

interface RateLimitOptions {
  limiter: Ratelimit;
  identifier?: (req: NextRequest) => string;
}

export function createRateLimitMiddleware(options: RateLimitOptions) {
  const { limiter, identifier } = options;

  return async function rateLimitMiddleware(req: NextRequest) {
    const id = identifier
      ? identifier(req)
      : req.headers.get("x-forwarded-for") || "anonymous";

    const { success, limit, reset, remaining } = await limiter.limit(id);

    if (!success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          limit,
          reset,
          remaining,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    return null; // No rate limit exceeded, continue
  };
}
