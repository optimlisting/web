import { redirect } from "next/navigation";
import { getSession } from "@optim/auth";

export default async function OptimizePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  redirect("/optimize/manual");
}
