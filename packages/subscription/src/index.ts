import { prisma } from "@optim/db";
import { PLANS, type PlanKey } from "./config";

export { PLANS };
export type { PlanKey };
export type Plan = "FREE" | "STARTER" | "PROFESSIONAL";

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
  });
}

export async function getUsageLimit(userId: string): Promise<{
  plan: Plan;
  used: number;
  limit: number;
  isUnlimited: boolean;
}> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [subscription, usage] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.usage.aggregate({
      where: {
        userId,
        date: { gte: startOfMonth },
      },
      _sum: { optimizations: true },
    }),
  ]);

  const plan = subscription?.plan || "FREE";
  const planConfig = PLANS[plan as PlanKey];
  const limit = planConfig.optimizationsPerMonth;
  const used = usage._sum.optimizations || 0;

  return {
    plan,
    used,
    limit: limit === -1 ? Infinity : limit,
    isUnlimited: limit === -1,
  };
}

export async function trackUsage(userId: string, tokensUsed: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.usage.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    create: {
      userId,
      date: today,
      optimizations: 1,
      tokensUsed,
    },
    update: {
      optimizations: { increment: 1 },
      tokensUsed: { increment: tokensUsed },
    },
  });
}
