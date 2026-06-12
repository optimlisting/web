"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Button } from "@optim/ui/components/button";
import { Spinner } from "@optim/ui/lib/loading";

interface ManageBillingProps {
  isPaidPlan: boolean;
}

export function ManageBilling({ isPaidPlan }: ManageBillingProps) {
  const [loading, setLoading] = useState(false);

  const handlePortal = () => {
    if (!isPaidPlan) return;
    setLoading(true);
    try {
      // Dodo's static customer portal
      const businessId = process.env.NEXT_PUBLIC_DODO_BUSINESS_ID;
      const portalBase =
        process.env.NODE_ENV === "development" || process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
          ? "https://test.customer.dodopayments.com"
          : "https://customer.dodopayments.com";
      window.open(`${portalBase}/login/${businessId}`, "_blank");
    } catch (err) {
      toast.error("Could not open billing portal");
    }
    setLoading(false);
  };

  if (!isPaidPlan) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePortal}
      disabled={loading}
      className="bg-transparent p-4 text-muted-foreground"
    >
      {loading ? (
        <Spinner className="w-4 h-4 mr-2" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      Manage Billing
    </Button>
  );
}
