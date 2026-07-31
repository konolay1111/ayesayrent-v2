import Link from "next/link";
import {
  AdminHeader,
  AdminPageHeading,
} from "@/components/admin/AdminHeader";
import { RequestFilterTabs } from "@/components/admin/RequestFilterTabs";
import { BilingualLabel } from "@/components/BilingualLabel";
import {
  REQUEST_FILTER_OPTIONS,
  STATUS_LABELS,
  formatBudget,
  formatPublicPropertyReference,
  formatRequestDate,
  isRequestFilterKey,
  matchesRequestFilter,
  matchesRequestSearch,
  normalizeAvailabilityRequest,
  type AvailabilityRequestStatus,
  type RequestFilterKey,
} from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/supabase/server";

type AdminRequestsPageProps = {
  searchParams: Promise<{
    q?: string;
    filter?: string;
    status?: string;
  }>;
};

function StatusBadge({ status }: { status: AvailabilityRequestStatus }) {
  const label = STATUS_LABELS[status];

  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
      {label.workflow}
    </span>
  );
}

function formatPropertyCodes(codes: string[]) {
  if (codes.length === 0) {
    return "—";
  }

  return codes.map((code) => formatPublicPropertyReference(code)).join(", ");
}

export default async function AdminRequestsPage({
  searchParams,
}: AdminRequestsPageProps) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const activeFilter: RequestFilterKey = isRequestFilterKey(params.filter ?? "")
    ? (params.filter as RequestFilterKey)
    : "all";

  const { data: requests, error } = await supabase
    .from("availability_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load availability requests:", error);
  }

  const filteredRequests = ((requests ?? []) as Record<string, unknown>[])
    .map(normalizeAvailabilityRequest)
    .filter(
    (request) =>
      matchesRequestFilter(request, activeFilter) &&
      matchesRequestSearch(request, query),
    );

  return (
    <div className="min-h-full bg-white font-sans text-zinc-800">
      <AdminHeader currentPath="/admin/requests" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminPageHeading
          titleMyanmar="အခန်းလွတ် တောင်းဆိုချက်များ"
          titleEnglish="Availability Requests"
          description="Review inquiries, contact owners, update status, and manage customer follow-up."
        />

        <section className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm sm:p-6">
          <form className="grid gap-4 lg:grid-cols-[1fr_auto]" method="get">
            {activeFilter !== "all" ? (
              <input type="hidden" name="filter" value={activeFilter} />
            ) : null}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="search" className="text-sm font-medium text-zinc-700">
                <BilingualLabel
                  myanmar="ရှာဖွေရန်"
                  english="Search by name, phone, reference, or property"
                />
              </label>
              <input
                id="search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="AYR-REQ-... or R001"
                className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Search
              </button>
              {(query || activeFilter !== "all") && (
                <Link
                  href="/admin/requests"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-zinc-200 px-4 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>

          <div className="mt-5">
            <RequestFilterTabs activeFilter={activeFilter} query={query} />
          </div>

          {REQUEST_FILTER_OPTIONS.find((option) => option.key === "unavailable") ? (
            <p className="mt-3 text-xs text-zinc-500">
              Unavailable inquiries currently use the Cancelled status in the
              database.
            </p>
          ) : null}
        </section>

        {filteredRequests.length === 0 ? (
          <section className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-16 text-center">
            <p className="text-lg font-semibold text-zinc-900">
              {query || activeFilter !== "all"
                ? "No matching requests"
                : "No requests yet"}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              {query || activeFilter !== "all"
                ? "Try another filter or search term."
                : "New public inquiries will appear here."}
            </p>
          </section>
        ) : (
          <>
            <div className="mt-6 space-y-4 lg:hidden">
              {filteredRequests.map((request) => (
                <article
                  key={request.id}
                  className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-semibold text-emerald-700">
                        {request.request_reference}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-zinc-900">
                        {request.customer_name}
                      </p>
                      <p className="text-sm text-zinc-600">{request.phone_number}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-zinc-500">Contact</dt>
                      <dd className="mt-1 font-medium">{request.social_contact || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Property</dt>
                      <dd className="mt-1 font-medium">
                        {formatPropertyCodes(request.property_codes)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Area</dt>
                      <dd className="mt-1 font-medium">{request.preferred_area || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Budget</dt>
                      <dd className="mt-1 font-medium">
                        {formatBudget(request.monthly_budget)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Move-in</dt>
                      <dd className="mt-1 font-medium">
                        {request.move_in_date
                          ? formatRequestDate(request.move_in_date)
                          : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500">Submitted</dt>
                      <dd className="mt-1 font-medium">
                        {formatRequestDate(request.created_at)}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    href={`/admin/requests/${request.id}`}
                    className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    View Details
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-zinc-100 bg-white shadow-sm lg:block">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Reference</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Area</th>
                    <th className="px-4 py-3 font-medium">Move-in</th>
                    <th className="px-4 py-3 font-medium">Budget</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-zinc-50 align-top"
                    >
                      <td className="px-4 py-4 font-mono font-semibold text-emerald-700">
                        {request.request_reference}
                      </td>
                      <td className="px-4 py-4 font-medium text-zinc-900">
                        {request.customer_name}
                      </td>
                      <td className="px-4 py-4">{request.phone_number}</td>
                      <td className="px-4 py-4">{request.social_contact || "—"}</td>
                      <td className="px-4 py-4 font-mono text-xs text-emerald-700">
                        {formatPropertyCodes(request.property_codes)}
                      </td>
                      <td className="px-4 py-4">{request.preferred_area || "—"}</td>
                      <td className="px-4 py-4">
                        {request.move_in_date
                          ? formatRequestDate(request.move_in_date)
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        {formatBudget(request.monthly_budget)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-4 py-4 text-zinc-600">
                        {formatRequestDate(request.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/admin/requests/${request.id}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
