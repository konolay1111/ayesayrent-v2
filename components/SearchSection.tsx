import { SearchFiltersForm } from "@/components/search/SearchFiltersForm";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { getSearchFilterOptions } from "@/lib/public-search/queries";
import type { PublicSearchFilters } from "@/lib/public-search/types";
import {
  publicContainerClass,
  publicSearchPanelClass,
  publicSectionClass,
  typeH2Class,
  typeSmallClass,
} from "@/lib/public-ui";

const emptyFilters: PublicSearchFilters = {
  area: "",
  station: "",
  minRent: null,
  maxRent: null,
  pet: "all",
};

export async function SearchSection() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const filterOptions = await getSearchFilterOptions();

  return (
    <section id="search" className={`${publicSectionClass} bg-background`}>
      <div className={publicContainerClass}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={typeH2Class}>{t("search.title")}</h2>
          <p className={`mt-4 ${typeSmallClass}`}>{t("search.subtitle")}</p>
        </div>

        <div className={`mx-auto mt-12 max-w-5xl ${publicSearchPanelClass}`}>
          <SearchFiltersForm
            options={filterOptions}
            filters={emptyFilters}
            id="home-search-filters"
          />
        </div>
      </div>
    </section>
  );
}
