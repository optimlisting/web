"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../components/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.",
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/18 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
