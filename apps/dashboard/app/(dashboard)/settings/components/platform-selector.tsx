"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@optim/ui/components/card";
import { ConfirmDialog } from "@optim/ui/components/confirm-dialog";
import { Spinner } from "@optim/ui/lib/loading";

interface PlatformSelectorProps {
  currentPlan: string;
  selectedPlatform: string | null;
}

const PLATFORMS = [
  { id: "shopify", label: "Shopify", description: "Online store and point of sale", available: true },
  { id: "etsy", label: "Etsy", description: "Handmade, vintage, and craft supplies", available: true },
  { id: "ebay", label: "eBay", description: "Auctions and fixed-price listings", available: true },
  { id: "amazon", label: "Amazon", description: "Professional selling account", available: true },
];

export function PlatformSelector({ currentPlan, selectedPlatform }: PlatformSelectorProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [current, setCurrent] = useState(selectedPlatform);
  const [confirmPlatform, setConfirmPlatform] = useState<string | null>(null);
  const isPro = currentPlan === "PROFESSIONAL";

  const handleRequestChange = (platform: string) => {
    if (current) {
      toast.error("Platform can only be set once. Contact support if you need to change it.");
      return;
    }
    setConfirmPlatform(platform);
  };

  const handleConfirm = async () => {
    if (!confirmPlatform) return;
    setLoading(confirmPlatform);
    try {
      const response = await fetch("/dashboard/api/settings/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: confirmPlatform }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save platform");
      }

      setCurrent(confirmPlatform);
      toast.success(`${PLATFORMS.find((p) => p.id === confirmPlatform)?.label} selected — this cannot be changed later.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save platform");
    }
    setLoading(null);
    setConfirmPlatform(null);
  };

  // Pro users see all platforms
  if (isPro) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Access</CardTitle>
          <CardDescription>
            Your Professional plan includes all platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {PLATFORMS.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100"
              >
                <Settings className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{p.label}</p>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
                {p.available && <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Available</span>}
                {!p.available && <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Coming Soon</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free/Starter: choose one
  return (
    <>
      <Card id="platform-selection">
        <CardHeader>
          <CardTitle>Choose Your Platform</CardTitle>
          <CardDescription>
            Your plan includes one platform. Select the marketplace you sell on.
            {current && (
              <span className="text-amber-600 font-medium block mt-1">
                This choice is permanent. Contact <a href="mailto:support@optimListing.com" className="font-bold underline">support</a> if you need to change it.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {PLATFORMS.map((p) => {
              const isSelected = current === p.id;
              const isDisabled = !p.available || (current !== null && current !== p.id);

              return (
                <button
                  key={p.id}
                  onClick={() => !isDisabled && handleRequestChange(p.id)}
                  disabled={isDisabled || loading !== null}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                    isSelected
                      ? "border-brand-500 bg-brand-50"
                      : isDisabled
                      ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                      : "border-gray-200 hover:border-gray-300 cursor-pointer"
                  }`}
                >
                  <Settings
                    className={`w-5 h-5 ${
                      isSelected ? "text-brand-600" : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{p.label}</p>
                      {isSelected && (
                        <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                      {!p.available && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </div>
                  {loading === p.id && <Spinner className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmPlatform !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmPlatform(null);
        }}
        title="Confirm Platform Selection"
        description={`You are choosing ${
          PLATFORMS.find((p) => p.id === confirmPlatform)?.label
        } as your platform. This can only be set once and cannot be changed later. Are you sure?`}
        confirmText="Yes, Select This Platform"
        requireTyping="CONFIRM"
        onConfirm={handleConfirm}
      />
    </>
  );
}
