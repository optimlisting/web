import { getSession } from "@optim/auth";
import { redirect } from "next/navigation";

export default async function AuditPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return redirect("/optimize")
}
