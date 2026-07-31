"use client";

import {
  getCompanyLineId,
  isCompanyLineConfigured,
} from "@/lib/config/company";

type LineLinkProps = {
  className?: string;
  label?: string;
  missingHint?: string;
};

export function LineLink({
  className = "",
  label = "LINE ID",
  missingHint = "LINE ID — add in lib/config/company.ts",
}: LineLinkProps) {
  const lineId = getCompanyLineId();

  if (!isCompanyLineConfigured()) {
    return (
      <span className={`text-sm text-muted-foreground ${className}`} role="status">
        {missingHint}
      </span>
    );
  }

  return (
    <p className={`text-sm text-foreground ${className}`}>
      <span className="font-medium">{label}: </span>
      <span className="font-mono select-all">{lineId}</span>
    </p>
  );
}
