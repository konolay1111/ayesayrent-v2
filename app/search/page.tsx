import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  SearchPageHeader,
  SearchResultsClient,
} from "@/components/search/SearchResultsClient";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import {
  getSearchFilterOptions,
  parseSearchFilters,
  searchPublicListings,
} from "@/lib/public-search/queries";
import { getButtonClassName } from "@/components/ui/Button";
import {
  publicContainerClass,
  publicPageClass,
} from "@/lib/public-ui";

type SearchPageProps = {
  searchParams: Promise<{
    area?: string;
    station?: string;
    minRent?: string;
    maxRent?: string;
    pet?: string;
  }>;
};

function formatFilterSummary(
  filters: ReturnType<typeof parseSearchFilters>,
  t: (key: Parameters<typeof translate>[1]) => string,
) {
  const parts: string[] = [];

  parts.push(filters.area || t("search.allAreas"));
  parts.push(filters.station || t("search.allStations"));

  if (filters.minRent !== null || filters.maxRent !== null) {
    const min =
      filters.minRent !== null ? `฿${filters.minRent.toLocaleString()}` : "Any";
    const max =
      filters.maxRent !== null ? `฿${filters.maxRent.toLocaleString()}` : "Any";
    parts.push(`${min} – ${max}`);
  }

  if (filters.pet === "yes") {
    parts.push(t("search.petYes"));
  } else if (filters.pet === "no") {
    parts.push(t("search.petNo"));
  }

  return parts.join(" • ");
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  const params = await searchParams;
  const filters = parseSearchFilters(params);
  const [filterOptions, searchResult] = await Promise.all([
    getSearchFilterOptions(),
    searchPublicListings(filters),
  ]);

  const { results, error } = searchResult;
  const hasActiveFilters =
    Boolean(filters.area) ||
    Boolean(filters.station) ||
    filters.minRent !== null ||
    filters.maxRent !== null ||
    filters.pet !== "all";

  return (
    <div className={publicPageClass}>
      <Header />

      <main className="flex-1">
        <SearchPageHeader />

        <div className={`${publicContainerClass} px-4 py-8 sm:px-6 lg:px-8`}>
          <SearchResultsClient
            filters={filters}
            filterOptions={filterOptions}
            results={results}
            error={error}
            filterSummary={formatFilterSummary(filters, t)}
          />

          {hasActiveFilters && results.length > 0 ? (
            <div className="mt-10 text-center">
              <Link href="/search" className={getButtonClassName("secondary", "md")}>
                {t("search.clear")}
              </Link>
            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
