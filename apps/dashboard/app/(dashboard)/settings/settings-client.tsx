"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@optim/ui/components/card";
import { Avatar, AvatarFallback, AvatarImage } from "@optim/ui/components/avatar";
import { Badge } from "@optim/ui/components/badge";
// import { Separator } from "@optim/ui/components/separator";
import { User, Mail, Sparkles, Check, CreditCard } from "lucide-react";

import { PlatformSelector } from "./components/platform-selector";
import { ManageBilling } from "./components/manage-billing";
import { UpgradePlans } from "./components/upgrade-plans";
import { EtsyConnect } from "./components/etsy-connect";
import { DangerZone } from "./components/danger-zone";

interface SettingsClientProps {
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
  selectedPlatform
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage your account and subscription.
        </p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PlatformSelector
        currentPlan={subscription.plan}
        selectedPlatform={selectedPlatform}
      />

      {/* Plaform Integration */}
      {(selectedPlatform === "etsy" || subscription.plan === "PROFESSIONAL") && (
        <EtsyConnect plan={subscription.plan} />
      )}

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current plan and billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {planConfig.name} Plan
                  </span>
                  <Badge
                    variant={
                      subscription.status === "ACTIVE" ? "default" : "destructive"
                    }
                  >
                    {subscription.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">
                  {planConfig.price === 0
                    ? "Free forever"
                    : `$${planConfig.price}/month`}
                  {planConfig.optimizationsPerMonth === -1
                    ? " · Unlimited optimizations"
                    : ` · ${planConfig.optimizationsPerMonth} optimizations/mo`}
                </p>
              </div>
            </div>
            <ManageBilling isPaidPlan={isPaidPlan} />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Plan Features
            </h4>
            <ul className="space-y-2">
              {planConfig.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {periodEnd && isPaidPlan && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4 text-gray-400" />
              Current period ends on {periodEnd}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Plans */}
      <div id="upgrade-plans">
        <UpgradePlans currentPlan={subscription.plan} user={user} />
      </div>

      {/* Danger Zone */}
      <DangerZone />
    </div>
  );
}
