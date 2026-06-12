'use client';

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-150"
      style={{
        background: copied ? "rgba(0,229,160,0.12)" : "rgba(255,255,255,0.05)",
        color: copied ? "#00E5A0" : "#8899BB",
        fontSize: "0.78rem",
        fontWeight: 500,
        border: `1px solid ${copied ? "rgba(0,229,160,0.25)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
