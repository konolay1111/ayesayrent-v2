"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IconInbox } from "@/components/icons";
import { SearchExperience } from "@/components/search/SearchExperience";
import { SearchResultCard } from "@/components/search/SearchResultCard";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { getButtonClassName } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import type { PublicListingResult, SearchFilterOptions } from "@/lib/public-search/types";
import type { PublicSearchFilters } from "@/lib/public-search/types";
import {
  publicCardClass,
  publicContainerClass,
  publicDisclaimerClass,
  typeH1Class,
  typeSmallClass,
} from "@/lib/public-ui";

type SearchResultsClientProps = {
  filters: PublicSearchFilters;
  filterOptions: SearchFilterOptions;
  results: PublicListingResult[];
  error: string | null;
  filterSummary: string;
};

export function SearchResultsClient({
  filters,
  filterOptions,
  results,
  error,
  filterSummary,
}: SearchResultsClientProps) {
  const { t } = useTranslation();

  return (
    <>
      <SearchExperience options={filterOptions} filters={filters} />

      <section aria-live="polite" className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{filterSummary}</p>
            <p className={`mt-1 ${typeSmallClass}`}>
              {results.length} {t("search.found")}
            </p>
          </div>
          <Link
            href="/shortlist"
            className={getButtonClassName("ghost", "md", "w-full sm:w-auto")}
          >
            <IconInbox size={18} />
            {t("search.viewShortlist")}
          </Link>
        </div>
      </section>

      {error ? (
        <section className={`${publicCardClass} mt-10 px-6 py-16 text-center sm:px-10`}>
          <EmptyIllustration variant="error" className="mb-8" />
          <h2 className="text-lg font-semibold text-destructive">{error}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("search.errorRefresh")}</p>
          <Link href="/search" className={`${getButtonClassName("secondary", "md")} mt-8 inline-flex`}>
            {t("error.retry")}
          </Link>
        </section>
      ) : results.length === 0 ? (
        <section className={`${publicCardClass} mt-10 px-6 py-16 text-center sm:px-10`}>
          <EmptyIllustration variant="search" className="mb-8" />
          <h2 className="text-lg font-semibold text-foreground">{t("search.noResults")}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t("search.noResultsHint")}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/search" className={getButtonClassName("primary", "md")}>
              {t("search.resetFilters")}
            </Link>
            <Link href="/search" className={getButtonClassName("outline", "md")}>
              {t("search.submit")}
            </Link>
          </div>
        </section>
      ) : (
        <section aria-labelledby="results-heading" className="mt-10">
          <h2 id="results-heading" className="sr-only">
            {t("search.resultsSubtitle")}
          </h2>
          <ul className="grid gap-8 lg:grid-cols-2">
            {results.map((listing, index) => (
              <li key={`${listing.propertyId}:${listing.roomRateId}`}>
                <SearchResultCard listing={listing} index={index} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

export function SearchPageHeader() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-border bg-card px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className={publicContainerClass}>
        <h1 className={typeH1Class}>{t("search.resultsTitle")}</h1>
        <p className="mt-3 text-sm font-medium text-primary">{t("search.resultsSubtitle")}</p>
        <p className={`mt-6 max-w-3xl ${publicDisclaimerClass}`}>
          {t("availability.disclaimer")}
        </p>
      </div>
    </section>
  );
}
