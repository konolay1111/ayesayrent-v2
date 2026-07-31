"use client";

import { useMemo, useState } from "react";
import { IconSearch } from "@/components/icons";
import { getButtonClassName } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import type {
  PublicSearchFilters,
  SearchFilterOptions,
} from "@/lib/public-search/types";
import {
  publicInputClass,
  publicSelectClass,
  typeLabelClass,
} from "@/lib/public-ui";
import { cn } from "@/lib/cn";

type SearchFiltersFormProps = {
  options: SearchFilterOptions;
  filters: PublicSearchFilters;
  layout?: "stacked" | "horizontal";
  id?: string;
};

export function SearchFiltersForm({
  options,
  filters,
  layout = "stacked",
  id = "search-filters-form",
}: SearchFiltersFormProps) {
  const { t } = useTranslation();
  const [selectedArea, setSelectedArea] = useState(filters.area);

  const stationOptions = useMemo(() => {
    if (selectedArea && options.stationsByArea[selectedArea]) {
      return options.stationsByArea[selectedArea];
    }

    return options.allStations;
  }, [options.allStations, options.stationsByArea, selectedArea]);

  const selectedStationStillValid =
    !filters.station || stationOptions.includes(filters.station);

  const isHorizontal = layout === "horizontal";

  return (
    <form
      id={id}
      action="/search"
      method="get"
      className={cn(
        isHorizontal
          ? "flex flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-end"
          : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      <FilterField
        label={t("search.area")}
        htmlFor="area"
        className={isHorizontal ? "min-w-[10rem] flex-1" : undefined}
      >
        <select
          id="area"
          name="area"
          value={selectedArea}
          onChange={(event) => setSelectedArea(event.target.value)}
          className={publicSelectClass}
        >
          <option value="">{t("search.allAreas")}</option>
          {options.areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField
        label={t("search.station")}
        htmlFor="station"
        className={isHorizontal ? "min-w-[12rem] flex-1" : undefined}
      >
        <select
          id="station"
          name="station"
          defaultValue={selectedStationStillValid ? filters.station : ""}
          key={`${selectedArea}-${stationOptions.join("|")}`}
          className={publicSelectClass}
        >
          <option value="">{t("search.allStations")}</option>
          {stationOptions.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </FilterField>

      <FilterField
        label={t("search.minRent")}
        htmlFor="minRent"
        className={isHorizontal ? "min-w-[8rem] flex-1" : undefined}
      >
        <input
          id="minRent"
          name="minRent"
          type="number"
          min={0}
          step={500}
          inputMode="numeric"
          placeholder="5000"
          defaultValue={filters.minRent ?? ""}
          className={publicInputClass}
        />
      </FilterField>

      <FilterField
        label={t("search.maxRent")}
        htmlFor="maxRent"
        className={isHorizontal ? "min-w-[8rem] flex-1" : undefined}
      >
        <input
          id="maxRent"
          name="maxRent"
          type="number"
          min={0}
          step={500}
          inputMode="numeric"
          placeholder="12000"
          defaultValue={filters.maxRent ?? ""}
          className={publicInputClass}
        />
      </FilterField>

      <FilterField
        label={t("search.pet")}
        htmlFor="pet"
        className={isHorizontal ? "min-w-[8rem] flex-1" : undefined}
      >
        <select
          id="pet"
          name="pet"
          defaultValue={
            filters.pet === "yes" ? "true" : filters.pet === "no" ? "false" : ""
          }
          className={publicSelectClass}
        >
          <option value="">{t("search.petAll")}</option>
          <option value="true">{t("search.petYes")}</option>
          <option value="false">{t("search.petNo")}</option>
        </select>
      </FilterField>

      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row",
          isHorizontal ? "w-full shrink-0 xl:w-auto xl:pb-0.5" : "sm:col-span-2 lg:col-span-3",
        )}
      >
        <button
          type="submit"
          className={getButtonClassName(
            "primary",
            "md",
            isHorizontal ? "flex-1 xl:flex-none xl:px-8" : "flex-1 sm:flex-none sm:px-10",
          )}
        >
          <IconSearch size={18} />
          {t("search.submit")}
        </button>

        <a
          href="/search"
          className={getButtonClassName(
            "secondary",
            "md",
            isHorizontal ? "flex-1 xl:flex-none xl:px-8" : "flex-1 sm:flex-none sm:px-10",
          )}
        >
          {t("search.clear")}
        </a>
      </div>
    </form>
  );
}

function FilterField({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className={typeLabelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}
