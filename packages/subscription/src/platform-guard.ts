import { prisma } from "@optim/db";
import { getUsageLimit } from "./index";
import { PLANS, ALL_PLATFORMS, type PlanKey, type Platform } from "./config";

export async function checkPlatformAccess(
  userId: string,
  platform: Platform
): Promise<{ allowed: boolean; error?: string }> {
  const usage = await getUsageLimit(userId);
  const planKey = usage.plan as PlanKey;
  const planConfig = PLANS[planKey];

  // Pro has access to everything
  if (planConfig.platforms === -1) {
    return { allowed: true };
  }

  // Free and Starter: check selected platform
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { selectedPlatform: true },
  });

  const selectedPlatform = subscription?.selectedPlatform;

  // No platform selected yet — prompt them to choose
  if (!selectedPlatform) {
    return {
      allowed: false,
      error: `You haven't selected a platform yet. Choose one in Settings to get started.`,
    };
  }

  // They selected a different platform
  if (selectedPlatform !== platform) {
    return {
      allowed: false,
      error: `Your plan only includes ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}. Upgrade to Professional for all platforms.`,
    };
  }

  return { allowed: true };
}

export async function setSelectedPlatform(
  userId: string,
  platform: Platform
): Promise<void> {
  const existing = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!existing) {
    // Create with defaults — shouldn't happen in normal flow
    await prisma.subscription.create({
      data: {
        userId,
        plan: "FREE",
        status: "ACTIVE",
        selectedPlatform: platform,
      },
    });
    return;
  }

  // Update existing subscription — only change the platform
  await prisma.subscription.update({
    where: { userId },
    data: { selectedPlatform: platform },
  });
}

export async function getSelectedPlatform(
  userId: string
): Promise<Platform | null> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { selectedPlatform: true, plan: true },
  });

  if (!subscription) return null;

  // Pro users have all platforms — return the first as default for display
  if (PLANS[subscription.plan as PlanKey].platforms === -1) {
    return null; // null means "all platforms"
  }

  return (subscription.selectedPlatform as Platform) || null;
}
