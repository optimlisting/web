"use client";

import { authClient } from "@optim/auth/src/client";
import { Button } from "@optim/ui/components/button";
import { LogOut } from "lucide-react";

const handleSignOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/dashboard/sign-in";
      },
    },
  });
};

export function SignOutButton() {
  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}

export function SignOutIcon() {
  return (
    <button
      onClick={handleSignOut}
      title="Sign out"
      className="text-muted-foreground hover:text-white transition-colors cursor-pointer"
    >
      <LogOut size={15} />
    </button>
  )
}
