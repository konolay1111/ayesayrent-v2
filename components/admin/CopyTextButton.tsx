"use client";

import { useState } from "react";

type CopyTextButtonProps = {
  value: string;
  label: string;
  className?: string;
};

export function CopyTextButton({
  value,
  label,
  className = "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
}: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
