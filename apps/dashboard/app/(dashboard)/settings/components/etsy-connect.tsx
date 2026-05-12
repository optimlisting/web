"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Unlink, Store } from "lucide-react";
import { Button } from "@optim/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@optim/ui/components/card";
import { Spinner } from "@optim/ui/lib/loading";

interface EtsyConnectProps {
  plan: string;
}

export function EtsyConnect({ plan }: EtsyConnectProps) {
  const searchParams = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [shopName, setShopName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch("/dashboard/api/connections/etsy/status");
      const data = await response.json();
      setConnected(data.connected);
      setShopName(data.shopName || null);
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const status = searchParams.get("etsy");
    if (status === "connected") {
      toast.success("Etsy shop connected!");
      checkStatus();
    } else if (status === "error") {
      toast.error("Failed to connect Etsy shop");
    }
  }, [searchParams, checkStatus]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch("/dashboard/api/connections/etsy/auth");
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Failed to start Etsy connection");
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await fetch("/dashboard/api/connections/etsy/disconnect", { method: "POST" });
      setConnected(false);
      setShopName(null);
      toast.success("Etsy shop disconnected");
    } catch {
      toast.error("Failed to disconnect");
    }
    setLoading(false);
  };

  const isPaidPlan = plan !== "FREE";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Etsy Integration</CardTitle>
        <CardDescription>
          Connect your Etsy shop to automatically audit and optimize all your listings.
          {!isPaidPlan && (
            <span className="text-amber-600 font-medium block mt-1">
              Requires Starter or Professional plan.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Store className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {shopName || "Etsy Shop"} Connected
                </p>
                <p className="text-sm text-gray-600">
                  Your listings can now be audited automatically.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={loading}
            >
              {loading ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <Unlink className="w-4 h-4 mr-2" />
              )}
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Not Connected</p>
              <p className="text-sm text-gray-600">
                Connect to audit and optimize all your Etsy listings at once.
              </p>
            </div>
            <Button
              onClick={handleConnect}
              disabled={loading || !isPaidPlan}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {loading ? "Connecting..." : "Connect Etsy Shop"}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {/* Etsy disclaimer */}
        <p className="text-xs text-gray-400 mt-4">
          The term "Etsy" is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
        </p>
      </CardFooter>
    </Card>
  );
}
