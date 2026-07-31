"use client";

import {
  getCompanyFacebook,
  isCompanyFacebookConfigured,
} from "@/lib/config/company";

type FacebookLinkProps = {
  className?: string;
  label?: string;
  missingHint?: string;
  variant?: "link" | "button";
};

export function FacebookLink({
  className = "",
  label = "Facebook Page",
  missingHint = "Facebook Page — add URL in company config",
  variant = "link",
}: FacebookLinkProps) {
  const facebookUrl = getCompanyFacebook();

  if (!isCompanyFacebookConfigured()) {
    return (
      <span className={`text-sm text-muted-foreground ${className}`} role="status">
        {missingHint}
      </span>
    );
  }

  const classNames =
    variant === "button"
      ? `inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 ${className}`
      : `inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary ${className}`;

  return (
    <a
      href={facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames}
    >
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      {label}
    </a>
  );
}
