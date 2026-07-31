import Link from "next/link";
import {
  AdminHeader,
  AdminPageHeading,
} from "@/components/admin/AdminHeader";
import { BilingualLabel } from "@/components/BilingualLabel";
import {
  STATUS_LABELS,
  formatRequestDate,
  type AvailabilityRequestStatus,
} from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/supabase/server";

function StatusBadge({ status }: { status: AvailabilityRequestStatus }) {
  const label = STATUS_LABELS[status];

  return (
    <span className="inline-flex flex-col rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-100">
      <span>{label.myanmar}</span>
      <span className="font-normal text-emerald-600/80">{label.english}</span>
    </span>
  );
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const { data: requests, error } = await supabase
    .from("availability_requests")
    .select(
      "id, request_reference, customer_name, phone_number, property_codes, status, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load availability requests:", error);
  }

  const allRequests = requests ?? [];
  const statusCounts = {
    total: allRequests.length,
    new: 0,
    contacting_owners: 0,
    availability_confirmed: 0,
    viewing_arranged: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const request of allRequests) {
    const status = request.status as AvailabilityRequestStatus;
    if (status in statusCounts) {
      statusCounts[status as keyof Omit<typeof statusCounts, "total">] += 1;
    }
  }

  const recentRequests = allRequests.slice(0, 5);

  const summaryCards = [
    {
      key: "total",
      myanmar: "စုစုပေါင်း တောင်းဆိုချက်",
      english: "Total requests",
      value: statusCounts.total,
    },
    {
      key: "new",
      myanmar: STATUS_LABELS.new.myanmar,
      english: STATUS_LABELS.new.english,
      value: statusCounts.new,
    },
    {
      key: "contacting_owners",
      myanmar: STATUS_LABELS.contacting_owners.myanmar,
      english: STATUS_LABELS.contacting_owners.english,
      value: statusCounts.contacting_owners,
    },
    {
      key: "availability_confirmed",
      myanmar: STATUS_LABELS.availability_confirmed.myanmar,
      english: STATUS_LABELS.availability_confirmed.english,
      value: statusCounts.availability_confirmed,
    },
    {
      key: "viewing_arranged",
      myanmar: STATUS_LABELS.viewing_arranged.myanmar,
      english: STATUS_LABELS.viewing_arranged.english,
      value: statusCounts.viewing_arranged,
    },
    {
      key: "completed",
      myanmar: STATUS_LABELS.completed.myanmar,
      english: STATUS_LABELS.completed.english,
      value: statusCounts.completed,
    },
    {
      key: "cancelled",
      myanmar: STATUS_LABELS.cancelled.myanmar,
      english: STATUS_LABELS.cancelled.english,
      value: statusCounts.cancelled,
    },
  ] as const;

  return (
    <div className="min-h-full bg-white font-sans text-zinc-800">
      <AdminHeader currentPath="/admin" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminPageHeading
          titleMyanmar="အက်ဒမင် ဒက်ရှ်ဘုတ်"
          titleEnglish="Admin Dashboard"
          description="Customer availability requests and operational status at a glance."
        />

        <section
          aria-labelledby="summary-heading"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <h2 id="summary-heading" className="sr-only">
            Request summary
          </h2>
          {summaryCards.map((card) => (
            <article
              key={card.key}
              className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-zinc-600">
                <BilingualLabel myanmar={card.myanmar} english={card.english} />
              </p>
              <p className="mt-3 text-3xl font-bold text-emerald-700">
                {card.value}
              </p>
            </article>
          ))}
        </section>

        <section
          aria-labelledby="recent-requests-heading"
          className="mt-10 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="recent-requests-heading"
                className="text-lg font-semibold text-zinc-900"
              >
                <BilingualLabel
                  myanmar="နောက်ဆုံး တောင်းဆိုချက် ၅ ခု"
                  english="Recent Requests"
                />
              </h2>
            </div>
            <Link
              href="/admin/requests"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 px-4 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <BilingualLabel
                myanmar="အားလုံးကြည့်ရန်"
                english="View all requests"
              />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <p className="mt-6 rounded-xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
              <BilingualLabel
                myanmar="တောင်းဆိုချက် မရှိသေးပါ"
                english="No requests yet"
              />
            </p>
          ) : (
            <>
              <div className="mt-6 space-y-4 md:hidden">
                {recentRequests.map((request) => (
                  <article
                    key={request.id}
                    className="rounded-xl border border-zinc-100 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm font-semibold text-emerald-700">
                          {request.request_reference}
                        </p>
                        <p className="mt-2 font-medium text-zinc-900">
                          {request.customer_name}
                        </p>
                        <p className="text-sm text-zinc-600">
                          {request.phone_number}
                        </p>
                      </div>
                      <StatusBadge
                        status={request.status as AvailabilityRequestStatus}
                      />
                    </div>
                    <p className="mt-3 text-xs text-zinc-500">
                      {formatRequestDate(request.created_at)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(request.property_codes as string[]).map((code) => (
                        <span
                          key={code}
                          className="rounded bg-emerald-50 px-2 py-1 font-mono text-xs text-emerald-700"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                    <Link
                      href="/admin/requests"
                      className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      <BilingualLabel myanmar="ကြည့်ရန်" english="View" />
                    </Link>
                  </article>
                ))}
              </div>

              <div className="mt-6 hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-zinc-100 text-zinc-500">
                    <tr>
                      <th className="px-3 py-3 font-medium">Reference</th>
                      <th className="px-3 py-3 font-medium">Customer</th>
                      <th className="px-3 py-3 font-medium">Phone</th>
                      <th className="px-3 py-3 font-medium">Property codes</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-3 py-3 font-medium">Created</th>
                      <th className="px-3 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b border-zinc-50 align-top"
                      >
                        <td className="px-3 py-4 font-mono font-semibold text-emerald-700">
                          {request.request_reference}
                        </td>
                        <td className="px-3 py-4">{request.customer_name}</td>
                        <td className="px-3 py-4">{request.phone_number}</td>
                        <td className="px-3 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(request.property_codes as string[]).map((code) => (
                              <span
                                key={code}
                                className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-xs text-emerald-700"
                              >
                                {code}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <StatusBadge
                            status={
                              request.status as AvailabilityRequestStatus
                            }
                          />
                        </td>
                        <td className="px-3 py-4 text-zinc-600">
                          {formatRequestDate(request.created_at)}
                        </td>
                        <td className="px-3 py-4">
                          <Link
                            href="/admin/requests"
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
