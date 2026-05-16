"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@optim/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@optim/ui/components/card";
import { Badge } from "@optim/ui/components/badge";
import { Spinner } from "@optim/ui/lib/loading";

interface UpgradePlansProps {
  currentPlan: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function UpgradePlans({ currentPlan, user }: UpgradePlansProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (plan: string) => {
    setLoading(plan);
    try {
      const response = await fetch("/dashboard/api/dodo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_cart: [
            {
              product_id:
                plan === "PROFESSIONAL"
                  ? process.env.NEXT_PUBLIC_DODO_PRO_PRODUCT_ID
                  : process.env.NEXT_PUBLIC_DODO_STARTER_PRODUCT_ID,
              quantity: 1,
            },
          ],
          customer: {
            email: user.email,
            name: user.name,
          },
          metadata: {
            userId: user.id,
            plan: plan,
          },
        }),
      });

      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to start checkout");
      }
    } catch {
      toast.error("Failed to start checkout");
    }
    setLoading(null);
  };

  if (currentPlan === "PROFESSIONAL") return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade Your Plan</CardTitle>
        <CardDescription>
          Get more optimizations and unlock advanced features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {currentPlan === "FREE" && (
            <div
              className="p-4 border border-gray-200 rounded-xl hover:border-brand-300 transition cursor-pointer"
              onClick={() => handleUpgrade("STARTER")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-600" />
                  <span className="font-semibold text-gray-900">Starter</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  $9<span className="text-sm text-gray-500">/mo</span>
                </span>
              </div>
              <ul className="space-y-1.5 mb-4">
                <li className="text-sm text-gray-600">15 optimizations/month</li>
                <li className="text-sm text-gray-600">1 platform of choice</li>
                <li className="text-sm text-gray-600">Advanced AI optimization</li>
                <li className="text-sm text-gray-600">Bulk processing (soon)</li>
              </ul>
              <Button
                className="w-full"
                disabled={loading === "STARTER"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpgrade("STARTER");
                }}
              >
                {loading === "STARTER" ? (
                  <Spinner className="w-4 h-4 mr-2" />
                ) : null}
                Upgrade to Starter
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          <div className="p-4 border-2 border-brand-200 rounded-xl bg-brand-50/50 relative">
            {currentPlan === "FREE" && (
              <div className="absolute -top-2 right-4">
                <Badge>Best Value</Badge>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span className="font-semibold text-gray-900">Professional</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                $16<span className="text-sm text-gray-500">/mo</span>
              </span>
            </div>
            <ul className="space-y-1.5 mb-4">
              <li className="text-sm text-gray-600">Unlimited optimizations</li>
              <li className="text-sm text-gray-600">All platforms (Etsy, eBay, Amazon)</li>
              <li className="text-sm text-gray-600">Priority AI processing</li>
              <li className="text-sm text-gray-600">CSV bulk import(soon)</li>
              {/* <li className="text-sm text-gray-600">Store integration</li> */}
              {/* <li className="text-sm text-gray-500">eBay & Amazon (coming soon)</li> */}
            </ul>
            <Button
              className="w-full"
              variant={currentPlan === "STARTER" ? "default" : "outline"}
              disabled={loading === "PROFESSIONAL"}
              onClick={() => handleUpgrade("PROFESSIONAL")}
            >
              {loading === "PROFESSIONAL" ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : null}
              {currentPlan === "STARTER" ? "Upgrade to Professional" : "Go Professional"}
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
