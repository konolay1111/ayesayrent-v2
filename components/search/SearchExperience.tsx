"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconSearch } from "@/components/icons";
import { SearchFiltersForm } from "@/components/search/SearchFiltersForm";
import { getButtonClassName } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import type { PublicSearchFilters, SearchFilterOptions } from "@/lib/public-search/types";
import type { TranslationKey } from "@/lib/i18n/types";
import { cn } from "@/lib/cn";
import { publicBadgeClass, publicSearchPanelClass } from "@/lib/public-ui";

type ActiveFilterChip = {
  key: string;
  label: string;
  href: string;
};

function buildFilterChips(
  filters: PublicSearchFilters,
  t: (key: TranslationKey) => string,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  const addChip = (key: string, label: string, omitKey: string) => {
    const params = new URLSearchParams();
    if (filters.area && omitKey !== "area") params.set("area", filters.area);
    if (filters.station && omitKey !== "station") params.set("station", filters.station);
    if (filters.minRent !== null && omitKey !== "minRent")
      params.set("minRent", String(filters.minRent));
    if (filters.maxRent !== null && omitKey !== "maxRent")
      params.set("maxRent", String(filters.maxRent));
    if (filters.pet === "yes" && omitKey !== "pet") params.set("pet", "true");
    if (filters.pet === "no" && omitKey !== "pet") params.set("pet", "false");
    const qs = params.toString();
    chips.push({ key, label, href: qs ? `/search?${qs}` : "/search" });
  };

  if (filters.area) addChip("area", filters.area, "area");
  if (filters.station) addChip("station", filters.station, "station");
  if (filters.minRent !== null)
    addChip("minRent", `≥ ฿${filters.minRent.toLocaleString()}`, "minRent");
  if (filters.maxRent !== null)
    addChip("maxRent", `≤ ฿${filters.maxRent.toLocaleString()}`, "maxRent");
  if (filters.pet === "yes") addChip("pet", t("search.petYes"), "pet");
  if (filters.pet === "no") addChip("pet", t("search.petNo"), "pet");

  return chips;
}

export function ActiveFilterChips({ filters }: { filters: PublicSearchFilters }) {
  const { t } = useTranslation();
  const chips = useMemo(() => buildFilterChips(filters, t), [filters, t]);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("search.activeFilters")}
      </span>
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          className={cn(
            publicBadgeClass,
            "inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80",
          )}
          aria-label={`${t("search.resetFilters")}: ${chip.label}`}
        >
          {chip.label}
          <span aria-hidden="true">×</span>
        </Link>
      ))}
      <Link
        href="/search"
        className="text-xs font-semibold text-primary transition-colors hover:underline"
      >
        {t("search.resetFilters")}
      </Link>
    </div>
  );
}

type SearchExperienceProps = {
  options: SearchFilterOptions;
  filters: PublicSearchFilters;
};

export function SearchExperience({ options, filters }: SearchExperienceProps) {
  const { t } = useTranslation();

  return (
    <>
      <section
        aria-labelledby="filter-heading"
        className={cn(publicSearchPanelClass, "hidden lg:block")}
      >
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 id="filter-heading" className="text-lg font-semibold text-foreground">
            {t("search.filters")}
          </h2>
          <ActiveFilterChips filters={filters} />
        </div>
        <SearchFiltersForm options={options} filters={filters} layout="horizontal" />
      </section>

      <MobileSearchFilters options={options} filters={filters} />
    </>
  );
}

function MobileSearchFilters({ options, filters }: SearchExperienceProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const activeCount = buildFilterChips(filters, t).length;

  return (
    <div className="lg:hidden">
      <div className="sticky top-[4.25rem] z-40 -mx-4 border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={getButtonClassName("secondary", "md", "w-full")}
        >
          <IconSearch size={18} />
          {t("search.openFilters")}
          {activeCount > 0 ? (
            <span className="ml-auto inline-flex h-6 min-w-6 animate-badge-pop items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </button>
        {activeCount > 0 ? (
          <div className="mt-3">
            <ActiveFilterChips filters={filters} />
          </div>
        ) : null}
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] animate-fade-in"
            aria-label={t("modal.cancel")}
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-title"
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[88dvh] overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl animate-fade-in-up"
          >
            <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-border" aria-hidden="true" />
            <h2 id="mobile-filter-title" className="text-lg font-semibold text-foreground">
              {t("search.filters")}
            </h2>
            <div className="mt-6">
              <SearchFiltersForm
                options={options}
                filters={filters}
                layout="stacked"
                id="mobile-search-filters"
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
