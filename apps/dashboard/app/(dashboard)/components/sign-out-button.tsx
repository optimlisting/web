"use client";

import { authClient } from "@optim/auth/src/client";
import { Button } from "@optim/ui/components/button";

export function SignOutButton() {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/dashboard/sign-in";
        },
      },
    });
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
