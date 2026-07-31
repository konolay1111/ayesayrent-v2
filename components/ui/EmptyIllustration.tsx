import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyIllustrationProps = {
  variant: "search" | "shortlist" | "request" | "property" | "error";
  className?: string;
};

export function EmptyIllustration({ variant, className }: EmptyIllustrationProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-to-br from-secondary to-muted",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-3 rounded-2xl border border-dashed border-primary/20" />
      <IllustrationSvg variant={variant} />
    </div>
  );
}

function IllustrationSvg({ variant }: { variant: EmptyIllustrationProps["variant"] }) {
  const common = "h-16 w-16 text-primary/40";

  switch (variant) {
    case "search":
      return (
        <svg className={common} fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth={2}>
          <circle cx="28" cy="28" r="16" />
          <path d="m40 40 14 14" strokeLinecap="round" />
        </svg>
      );
    case "shortlist":
      return (
        <svg className={common} fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth={2}>
          <path d="M32 48s-14-9-14-22a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 13-14 22-14 22Z" />
        </svg>
      );
    case "request":
      return (
        <svg className={common} fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth={2}>
          <rect x="12" y="10" width="40" height="44" rx="4" />
          <path d="M20 22h24M20 32h18M20 42h24" strokeLinecap="round" />
        </svg>
      );
    case "property":
      return (
        <svg className={common} fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth={2}>
          <path d="M10 48V24l22-14 22 14v24H10Z" />
          <path d="M26 48V34h12v14" />
        </svg>
      );
    case "error":
      return (
        <svg className={common} fill="none" viewBox="0 0 64 64" stroke="currentColor" strokeWidth={2}>
          <circle cx="32" cy="32" r="20" />
          <path d="M32 22v14M32 42h.01" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function EmptyStateWithIllustration({
  variant,
  icon,
  title,
  description,
  children,
  className,
}: {
  variant: EmptyIllustrationProps["variant"];
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      {icon ?? <EmptyIllustration variant={variant} className="mb-8" />}
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
