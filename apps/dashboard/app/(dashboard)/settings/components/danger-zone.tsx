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
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account. All your data will be permanently deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">
                Permanently delete your account, listings, and all associated data.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
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
