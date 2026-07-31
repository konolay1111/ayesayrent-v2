import Link from "next/link";
import {
  REQUEST_FILTER_OPTIONS,
  type RequestFilterKey,
} from "@/lib/admin/requests";

type RequestFilterTabsProps = {
  activeFilter: RequestFilterKey;
  query: string;
};

function buildFilterHref(filter: RequestFilterKey, query: string) {
  const params = new URLSearchParams();

  if (filter !== "all") {
    params.set("filter", filter);
  }

  if (query) {
    params.set("q", query);
  }

  const queryString = params.toString();
  return queryString ? `/admin/requests?${queryString}` : "/admin/requests";
}

export function RequestFilterTabs({
  activeFilter,
  query,
}: RequestFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {REQUEST_FILTER_OPTIONS.map((option) => {
        const isActive = option.key === activeFilter;

        return (
          <Link
            key={option.key}
            href={buildFilterHref(option.key, query)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-emerald-700 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
