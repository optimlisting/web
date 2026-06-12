import { getSession } from "@optim/auth";
import { redirect } from "next/navigation";
import { getSubscription, PLANS } from "@optim/subscription";
import { getSelectedPlatform } from "@optim/subscription/src/platform-guard";
import type { PlanKey } from "@optim/subscription";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const allPlans = PLANS
  const subscription = await getSubscription(session.user.id!);
  const currentPlan = (subscription?.plan || "FREE") as PlanKey;
  const planConfig = PLANS[currentPlan];
  const selectedPlatform = await getSelectedPlatform(session.user.id!);

  return (
    <SettingsClient
      plans={allPlans}
      user={{
        id: session.user.id!,
        name: session.user.name || "User",
        email: session.user.email || "",
        image: session.user.image,
      }}
      subscription={{
        plan: currentPlan,
        status: subscription?.status || "ACTIVE",
        currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() || null,
      }}
      planConfig={{
        name: planConfig.name,
        price: planConfig.price,
        optimizationsPerMonth: planConfig.optimizationsPerMonth,
        platforms: planConfig.platforms,
        features: [...planConfig.features],
      }}
      selectedPlatform={selectedPlatform}
    />
  );
}
