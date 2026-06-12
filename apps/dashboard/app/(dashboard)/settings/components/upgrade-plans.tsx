"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@optim/ui/components/button";
import { Spinner } from "@optim/ui/lib/loading";
import { Zap, Check, ExternalLink } from "lucide-react";
import type { PlanKey, PlanConfig } from "@optim/subscription";

interface UpgradePlansProps {
  plans: Record<PlanKey, PlanConfig>;
  currentPlan: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function UpgradePlans({ currentPlan, user, plans }: UpgradePlansProps) {
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
    <div id="upgrade-plans">
      <p className="text-[0.82rem] font-semibold text-muted-foreground mb-3 tracking-[0.06em] uppercase">
        Upgrade Your Plan
      </p>
      {/* Starter */}
      <div className="grid md:grid-cols-2 gap-3">
        {currentPlan === "FREE" && (
          <div className="flex flex-col p-4 border rounded-xl border bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A78BFA]" />
                <span className="font-bold text-foreground text-[0.9rem]">{plans.STARTER.name}</span>
              </div>
              <span className="font-bricolage font-bold text-foreground text-[1.1rem]">
                ${plans.STARTER.price}<span className="text-sm text-muted-foreground">/mo</span>
              </span>
            </div>
            <ul className="space-y-1.5 mb-4">
              {plans.STARTER.features.map((item, i) => (
                <li key={i} className="flex items-center text-[0.78rem] text-muted-foreground gap-1.5">
                  <Check size={11} style={{ color: "#00E5A0" }} strokeWidth={3} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button
              className="mt-auto w-full py-5 font-bold text-[0.82rem] transition-all duration-200 hover:opacity-90"
              disabled={loading === "STARTER"}
              onClick={(e) => {
                e.stopPropagation();
                handleUpgrade("STARTER");
              }}
            >
              {loading === "STARTER" ? (
                <Spinner className="w-4 h-4 text-muted-foreground" />
              ) : (
                <>
                  Upgrade to {plans.STARTER.name}
                  <ExternalLink size={12} />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Professional */}
        <div className="flex flex-col p-4 border rounded-xl border bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)] relative">
          {currentPlan === "FREE" && (
            <div
              className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "#0D1327", color: "#00E5A0", border: "1px solid rgba(0,229,160,0.3)" }}
            >
              Best Value
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#A78BFA]" />
              <span className="font-bold text-foreground text-[0.9rem]">{plans.PROFESSIONAL.name}</span>
            </div>
            <span className="font-bricolage font-bold text-foreground text-[1.1rem]">
              ${plans.PROFESSIONAL.price}<span className="text-sm text-muted-foreground">/mo</span>
            </span>
          </div>
          <ul className="space-y-1.5 mb-4">
            {plans.PROFESSIONAL.features.map((item, i) => (
              <li key={i} className="flex items-center text-[0.78rem] text-muted-foreground gap-1.5">
                <Check size={11} style={{ color: "#00E5A0" }} strokeWidth={3} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-auto w-full py-5 font-bold text-[0.82rem] text-[#00E5A0] bg-transparent transition-all duration-200 hover:bg-white/5"
            style={{
              borderColor: "rgba(0,229,160,0.4)",
              color: "#00E5A0",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}
            variant={currentPlan === "STARTER" ? "default" : "outline"}
            disabled={loading === "PROFESSIONAL"}
            onClick={() => handleUpgrade("PROFESSIONAL")}
          >
            {loading === "PROFESSIONAL" ? (
              <Spinner className="w-4 h-4 text-muted-foreground" />
            ) : (
              <>
                {currentPlan === "STARTER" ? "Upgrade to Professional" : "Go Professional"}
                <ExternalLink size={12} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
