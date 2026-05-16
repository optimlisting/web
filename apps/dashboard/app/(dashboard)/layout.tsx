import Link from "next/link";
import { getSession } from "@optim/auth";
import { redirect } from "next/navigation";
import { getUsageLimit } from "@optim/subscription";
import {
  LayoutDashboard,
  List,
  Settings,
  Sparkles,
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

  let isPaid = false;

  if (session?.user?.id) {
    try {
      const usage = await getUsageLimit(session.user.id);
      isPaid = usage.plan !== "FREE";
    } catch {
      // Ignore — default to free
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <img src="/dashboard/optim-logo.svg" alt="optim logo" className="h-6" />
              <span className="text-lg font-bold text-brand-600">OptimListing</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              // if (item.children) {
              //   return (
              //     <div key={item.href} className="space-y-1">
              //       <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-500">
              //         <item.icon className="w-5 h-5 text-gray-400" />
              //         {item.title}
              //       </div>
              //       <div className="ml-6 space-y-1">
              //         {item.children?.map((child:any) => {
              //           const isPaidFeature = child.requiresPaidPlan;
              //           return (
              //             <Link
              //               key={child.href}
              //               href={child.href}
              //               className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${
              //                 isPaidFeature && !isPaid
              //                   ? "text-gray-400 hover:text-gray-600"
              //                   : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              //               }`}
              //             >
              //               <child.icon className={`w-4 h-4 ${isPaidFeature ? "text-gray-300" : "text-gray-400"}`} />
              //               <span>{child.title}</span>
              //               {isPaidFeature && !isPaid && (
              //                 <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-auto">
              //                   upgrade
              //                 </span>
              //               )}
              //             </Link>
              //           );
              //         })}
              //       </div>
              //     </div>
              //   );
              // }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition"
                >
                  <item.icon className="w-5 h-5 text-gray-400" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            {/* <p className="text-[0.65rem] text-gray-400 leading-relaxed">
              The term "Etsy" is a trademark of Etsy, Inc. This application uses the Etsy API but is not endorsed or certified by Etsy, Inc.
            </p> */}
            <p className="text-xs text-gray-500">© 2026 OptimListing</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
