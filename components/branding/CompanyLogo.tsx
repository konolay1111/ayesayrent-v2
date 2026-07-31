"use client";

import Link from "next/link";
import { useState } from "react";
import { company, getCompanyLogoPath } from "@/lib/config/company";

type CompanyLogoProps = {
  className?: string;
  showText?: boolean;
};

export function CompanyLogo({ className = "", showText = true }: CompanyLogoProps) {
  const logoPath = getCompanyLogoPath();
  const [logoFailed, setLogoFailed] = useState(false);
  const showImage = Boolean(logoPath) && !logoFailed;

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${className}`}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoPath}
          alt={company.name}
          className="h-10 w-auto max-h-10 max-w-[10rem] object-contain dark:brightness-110"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          aria-hidden="true"
        >
          AR
        </span>
      )}
      {showText ? (
        <span className="text-xl font-bold tracking-tight text-primary">
          {company.name}
        </span>
      ) : null}
    </Link>
  );
}
