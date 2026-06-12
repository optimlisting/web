"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Spinner } from "../lib/loading";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  confirmVariant?: "default" | "destructive";
  requireTyping?: string;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  confirmVariant = "default",
  requireTyping,
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [typed, setTyped] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setTyped("");
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent — just reset loading
    }
    setLoading(false);
  };

  const handleOpenChange = (open: boolean) => {
    // Block closing the dialog while loading
    if (loading) return;
    
    // Reset state when closing
    if (!open) {
      setTyped("");
    }
    
    onOpenChange(open);
  };

  const canConfirm = requireTyping ? typed === requireTyping : true;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onPointerDownOutside={(e) => {
          if (loading) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (loading) e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/18 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="font-bricolage font-bold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground pt-2">{description}</DialogDescription>
        </DialogHeader>

        {requireTyping && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Type{" "}
              <span className="font-semibold text-foreground">{requireTyping}</span>{" "}
              to confirm:
            </p>
            <Input
              className="border border-primary py-5"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={requireTyping}
              disabled={loading}
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={!canConfirm || loading}
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Deleting...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
