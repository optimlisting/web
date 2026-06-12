'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@optim/ui/lib/utils';

export function NavLink({ href, children, ...rest }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      {...rest}
      href={href}
      className={cn(
        "flex items-center text-[0.88rem] gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group",
        isActive
          ? "font-semibold text-[#A78BFA] bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.25)]"
          : "font-medium text-[#8899BB] bg-transparent border-transparent"
      )}
    >
      {children}
      {isActive && (
        <ChevronRight size={13} className="ml-auto text-[#A78BFA]/70" />
      )}
    </Link>
  );
}
