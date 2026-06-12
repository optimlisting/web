import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, auth } from "@optim/auth";
import { getUsageLimit } from "@optim/subscription";
import { NavLink } from "./components/nav-link";
import { UsageProvider } from "./components/usage-context";
import { Progress } from "@optim/ui/components/progress";
import { SignOutIcon } from "./components/sign-out-button";
import {
  LayoutDashboard,
  List,
  Settings,
  Sparkles,
  LogOut
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    children: undefined
  },
  {
    title: "Optimize",
    href: "/optimize",
    icon: Sparkles,
    children: undefined
  },
  {
    title: "Listings",
    href: "/listings",
    icon: List,
    children: undefined
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    children: undefined
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const signOutAction = async () => {
    await auth.api.signOut();
    redirect("/sign-in");
  }

  const initials = session.user.name
      ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
      : session.user.email?.[0]?.toUpperCase() ?? "U";

  const usage = session?.user?.id ? await getUsageLimit(session.user.id) : null;
  const usagePercent = usage ? Math.round((usage.used / usage.limit) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#070B18] font-manrope">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-[rgba(10,15,30,0.98)] border-r border-[rgba(255,255,255,0.06)]">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dashboard/optim-logo.svg" alt="optim logo" className="h-8 w-auto" />
              <span className="text-[1rem] font-bricolage font-extrabold text-[#EEF2FF]">OptimListing</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                >
                  <item.icon size={16} className="shrink-0" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Plan badge */}
          {!usage?.isUnlimited && <div className="px-3 pb-3">
            <div
              className="px-3 py-3 rounded-xl border"
              style={{ background: "rgba(124,58,237,0.08)", borderColor: "rgba(124,58,237,0.2)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "#A78BFA", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {usage?.plan} Plan
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(0,229,160,0.12)", color: "#00E5A0" }}
                >
                  {usage?.used}/{usage?.limit} used
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                <Progress value={usagePercent} />
              </div>
              <Link
                href="/settings/#upgrade-plans"
                className="flex items-center justify-center w-full py-2 rounded-lg font-semibold text-center text-[0.78rem] text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                }}
              >
                <span>Upgrade Plan ↗</span>
              </Link>
            </div>
          </div>}

          {/* User */}
          <div className="px-4 py-4 flex items-center gap-3 border-t border-b border-[rgba(255,255,255,0.05)]">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-foreground text-[0.7rem] font-bold"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(0,229,160,0.3))" }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-foreground text-[0.82rem] text-ellipsis whitespace-nowrap overflow-hidden">
                {session.user.name}
              </div>
              <div className="font-semibold text-muted-foreground text-[0.72rem] text-ellipsis whitespace-nowrap overflow-hidden">
                {session.user.email}
              </div>
            </div>
            <SignOutIcon />
          </div>
          {/* Footer */}
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} OptimListing</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UsageProvider usage={usage}>
            {children}
          </UsageProvider>
        </div>
      </div>
    </div>
  );
}
