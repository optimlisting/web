"use client";

import { createContext, useContext } from "react";

interface UsageContextType {
  plan: string;
  used: number;
  limit: number;
  isUnlimited: boolean;
}

const UsageContext = createContext<UsageContextType | null>(null);

export function UsageProvider({ children, usage }: { children: React.ReactNode; usage: UsageContextType | null }) {
  return <UsageContext.Provider value={usage}>{children}</UsageContext.Provider>;
}

export function useUsage() {
  const context = useContext(UsageContext);
  return context;
}
