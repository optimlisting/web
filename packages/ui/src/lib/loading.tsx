import { Loader2 } from "lucide-react";
import { cn } from "./utils";

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export function LoadingDots({ className = "" }:{ className?: string }) {
  return (
    <>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div
            key={i}
            className={cn("w-2 h-2 rounded-full bg-[#7C3AED]", className )}
            style={{
              // background: "#7C3AED",
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.2);opacity:1} }`}</style>
    </>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner className="w-8 h-8 text-brand-600 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-foreground/10 shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-muted-foreground/10 rounded w-1/4 mb-4" />
      <div className="h-8 bg-muted-foreground/10 rounded w-1/2 mb-3" />
      <div className="h-3 bg-muted-foreground/10 rounded w-3/4" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-muted-foreground/10 rounded-t-xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 border-t border-foreground/10 flex items-center px-4">
          <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
