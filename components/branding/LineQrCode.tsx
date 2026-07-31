"use client";

import { useState } from "react";
import { getCompanyLineQrPath } from "@/lib/config/company";

type LineQrCodeProps = {
  className?: string;
  alt?: string;
  missingHint?: string;
};

export function LineQrCode({
  className = "",
  alt = "LINE QR Code",
  missingHint = "LINE QR — add public/20913.jpg",
}: LineQrCodeProps) {
  const qrPath = getCompanyLineQrPath();
  const [qrFailed, setQrFailed] = useState(false);

  if (!qrPath || qrFailed) {
    return (
      <div
        className={`flex h-36 w-36 max-w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted px-3 text-center text-xs leading-relaxed text-muted-foreground ${className}`}
        role="status"
      >
        {missingHint}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={qrPath}
      alt={alt}
      className={`h-36 w-36 max-w-full rounded-2xl border border-border bg-card object-contain p-2 ${className}`}
      onError={() => setQrFailed(true)}
    />
  );
}
