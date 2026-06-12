"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { PlanKey, PlanConfig } from "@optim/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@optim/ui/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@optim/ui/components/avatar";
import { Badge } from "@optim/ui/components/badge";
import { Check, CreditCard, Zap } from "lucide-react";

import { PlatformSelector } from "./components/platform-selector";
import { ManageBilling } from "./components/manage-billing";
import { UpgradePlans } from "./components/upgrade-plans";
import { DangerZone } from "./components/danger-zone";

interface SettingsClientProps {
  plans: Record<PlanKey, PlanConfig>;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: string | null;
  };
  selectedPlatform: string | null;
  planConfig: {
    name: string;
    price: number;
    optimizationsPerMonth: number;
    platforms: number;
    features: string[];
  };
}

export function SettingsClient({
  user,
  subscription,
  planConfig,
  selectedPlatform,
  plans
}: SettingsClientProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const periodEnd = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isPaidPlan = planConfig.price > 0;

  const searchParams = useSearchParams();
  const upgradeParam = searchParams.get("upgrade");

  useEffect(() => {
    if (upgradeParam) {
      setTimeout(() => {
        document.getElementById("upgrade-plans")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [upgradeParam]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-bricolage font-extrabold text-3xl text-foreground leading-[1.1]">Settings</h1>
        <p className="text-[0.92rem] text-muted-foreground mt-1">
          Manage your account and subscription.
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader className="border-b border-[rgba(255,255,255,0.07)]">
          <CardTitle className="font-bricolage font-bold text-foreground">Account</CardTitle>
          <CardDescription className="text-muted-foreground">Your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar
              className="h-12 w-12"
              style={{ border: user.image ? "2px solid rgba(124,58,237,0.3)" : "" }}
            >
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback
                className="font-bricolage font-bold text-foreground text-[1rem]"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(0,229,160,0.25))",
                  border: "2px solid rgba(124,58,237,0.3)"
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-[0.95rem]">{user.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-muted-foreground text-[0.85rem]">{user.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PlatformSelector
        currentPlan={subscription.plan}
        selectedPlatform={selectedPlatform}
      />

      {/* Subscription */}
      <Card>
        <CardHeader className="border-b border-[rgba(255,255,255,0.07)]">
          <CardTitle className="font-bricolage font-bold text-foreground">Subscription</CardTitle>
          <CardDescription className="text-muted-foreground">Your current plan and billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current plan */}
          <div
            className="flex items-center justify-between p-4 rounded-xl border mb-5"
            style={{ background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.2)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.15)" }}
              >
                <Zap size={16} style={{ color: "#A78BFA" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span style={{ color: "#EEF2FF", fontWeight: 700, fontSize: "0.9rem" }}>
                    {planConfig.name} Plan
                  </span>
                  <Badge
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(0,229,160,0.12)", color: "#00E5A0" }}
                    variant={
                      subscription.status === "ACTIVE" ? "default" : "destructive"
                    }
                  >
                    {subscription.status}
                  </Badge>
                </div>
                <div style={{ color: "#8899BB", fontSize: "0.8rem" }}>
                  {planConfig.price === 0
                    ? "Free forever"
                    : `$${planConfig.price}/month`}
                  {planConfig.optimizationsPerMonth === -1
                    ? " · Unlimited optimizations"
                    : ` · ${planConfig.optimizationsPerMonth} optimizations/mo`}
                </div>
              </div>
            </div>
            <ManageBilling isPaidPlan={isPaidPlan} />
          </div>

          {periodEnd && isPaidPlan && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              Current period ends on {periodEnd}
            </div>
          )}

          {/* Plan features */}
          <div>
            <h4 className="text-[0.82rem] font-semibold text-muted-foreground mb-3 tracking-[0.06em] uppercase">
              Plan Features
            </h4>
            <ul className="space-y-2">
              {planConfig.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3] text-[#00E5A0] flex-shrink-0" />
                  <span className="text-[#C4D0F0] text-[0.88rem]">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrade plans */}
          <UpgradePlans plans={plans} currentPlan={subscription.plan} user={user} />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <DangerZone />
    </div>
  );
}
