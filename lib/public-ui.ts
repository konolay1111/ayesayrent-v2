/** Shared Tailwind class strings for the public-facing UI. */

import { cn } from "./cn";

/* ── Layout ─────────────────────────────────────────── */

export const publicPageClass =
  "flex min-h-full flex-col bg-background pb-20 font-sans text-foreground antialiased lg:pb-0";

export const publicContainerClass = "mx-auto max-w-6xl";

export const publicSectionClass =
  "px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28";

export const publicSectionGapClass = "space-y-12 sm:space-y-16";

export const publicHeaderClass =
  "sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80";

/* ── Typography ─────────────────────────────────────── */

export const typeHeroClass =
  "text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]";

export const typeH1Class =
  "text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl";

export const typeH2Class =
  "text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl";

export const typeH3Class = "text-lg font-semibold text-foreground";

export const typeSubtitleClass =
  "text-base leading-relaxed text-muted-foreground sm:text-lg";

export const typeBodyClass = "text-base leading-relaxed text-foreground";

export const typeSmallClass = "text-sm leading-relaxed text-muted-foreground";

export const typeLabelClass = "text-sm font-medium text-foreground";

export const typeOverlineClass =
  "text-xs font-semibold uppercase tracking-wider text-primary";

export const publicSubtextClass = "text-xs font-normal text-muted-foreground";

/* ── Surfaces ───────────────────────────────────────── */

export const publicCardClass =
  "rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm shadow-black/[0.04] dark:shadow-black/25";

export const publicCardInteractiveClass = cn(
  publicCardClass,
  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-black/40",
);

export const publicSearchPanelClass = cn(
  publicCardClass,
  "p-6 shadow-md sm:p-8 lg:p-10",
);

export const publicDisclaimerClass =
  "rounded-xl border border-[var(--accent-warn-border)] bg-[var(--accent-warn-bg)] px-4 py-3.5 text-sm leading-relaxed text-[var(--accent-warn-fg)]";

/* ── Form controls ──────────────────────────────────── */

export const publicInputClass =
  "h-12 w-full rounded-xl border border-border bg-input px-4 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60";

export const publicSelectClass = publicInputClass;

/* ── Buttons (base + variants) ──────────────────────── */

const publicBtnBaseClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold leading-snug transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

export const publicBtnPrimaryClass = cn(
  publicBtnBaseClass,
  "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25",
);

export const publicBtnSecondaryClass = cn(
  publicBtnBaseClass,
  "border border-border bg-card text-foreground hover:border-primary/30 hover:bg-secondary hover:text-secondary-foreground",
);

export const publicBtnOutlineClass = cn(
  publicBtnBaseClass,
  "border-2 border-primary/40 bg-transparent text-primary hover:bg-primary/5 hover:border-primary",
);

export const publicBtnGhostClass = cn(
  publicBtnBaseClass,
  "border border-primary/15 bg-secondary/80 text-secondary-foreground hover:border-primary/30 hover:bg-secondary",
);

export const publicBtnDestructiveClass = cn(
  publicBtnBaseClass,
  "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/15",
);

export const publicBtnSmClass = "min-h-10 px-4 text-sm";

export const publicBtnLgClass = "min-h-14 px-8 text-base";

export const publicNavLinkClass =
  "rounded-lg px-1 py-0.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/25";

/* ── Skeleton ───────────────────────────────────────── */

export const publicSkeletonClass = "animate-pulse rounded-xl bg-muted";

export const publicSkeletonShimmerClass = "skeleton-shimmer rounded-xl";

/* ── Animations ─────────────────────────────────────── */

export const publicFadeInClass = "animate-fade-in";

export const publicStaggerItemClass = "animate-fade-in-up";

export const publicBadgeClass =
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-border";
