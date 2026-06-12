"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@optim/auth/src/client";
import { Trash2 } from "lucide-react";
import { Button } from "@optim/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@optim/ui/components/card";
import { ConfirmDialog } from "@optim/ui/components/confirm-dialog";

export function DangerZone() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch("/dashboard/api/account/delete", { method: "POST" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }
      toast.success("Account deleted");
      await authClient.signOut();
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete account";
      toast.error(message);
      setDeleting(false);
      throw error;
    }
  };

  return (
    <>
      <Card className="py-0 bg-[rgba(239,68,68,0.04)] border border-[rgba(239,68,68,0.2)]">
        <CardHeader className="py-4 border-b border-[rgba(239,68,68,0.15)]">
          <CardTitle className="font-bricolage font-bold text-[#ef4444] text-[1rem]">Danger Zone</CardTitle>
          <CardDescription className="text-[0.82rem] text-muted-foreground">
            Irreversible actions for your account. All your data will be permanently deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-5 flex items-center justify-between">
            <div>
              <p className="text-[#EEF2FF] text-[0.9rem] font-semibold">Delete Account</p>
              <p className="text-[0.82rem] text-muted-foreground">
                Permanently delete your account, listings, and all associated data.
              </p>
            </div>
            <Button
              className="gap-2 px-4 py-5 font-bold border border-[rgba(239,68,68,0.4)]"
              variant="destructive"
              size="sm"
              onClick={() => setShowDialog(true)}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!deleting) setShowDialog(open);
        }}
        title="Delete Account"
        description="This action cannot be undone. Your account, all your optimized listings, usage history, and subscription will be permanently deleted."
        confirmText="Delete Account"
        confirmVariant="destructive"
        requireTyping="DELETE"
        onConfirm={handleDelete}
      />
    </>
  );
}
