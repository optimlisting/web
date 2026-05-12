import { getSession } from "@optim/auth";
import { redirect } from "next/navigation";
import { AuditClient } from "./audit-client";

export default async function AuditPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return <AuditClient />
}
