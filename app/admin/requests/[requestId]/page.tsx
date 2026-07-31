import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminHeader,
  AdminPageHeading,
} from "@/components/admin/AdminHeader";
import { CustomerPhotoShareSection } from "@/components/admin/CustomerPhotoShareSection";
import { RequestQuickActions } from "@/components/admin/RequestQuickActions";
import { RequestStatusControls } from "@/components/admin/RequestStatusControls";
import { isShareEligibleStatus } from "@/lib/customer-photo-share/constants";
import {
  getPropertyPhotosForShareSelection,
  getRequestPhotoShares,
} from "@/lib/customer-photo-share/queries";
import { BilingualLabel } from "@/components/BilingualLabel";
import {
  getAvailabilityRequestById,
  getRequestPropertySummaries,
} from "@/lib/admin/request-details";
import {
  STATUS_LABELS,
  formatBudget,
  formatPublicPropertyReference,
  formatRequestDate,
  parseCustomerInquiryNotes,
} from "@/lib/admin/requests";

type AdminRequestDetailPageProps = {
  params: Promise<{
    requestId: string;
  }>;
};

function formatRent(value: number | null) {
  if (value === null) {
    return "—";
  }

  return `฿${value.toLocaleString()}`;
}

function formatRentRange(
  roomRates: Array<{ monthlyRentThb: number | null }>,
) {
  const rents = roomRates
    .map((roomRate) => roomRate.monthlyRentThb)
    .filter((value): value is number => value !== null && value > 0);

  if (rents.length === 0) {
    return "Rent not listed";
  }

  const minRent = Math.min(...rents);
  const maxRent = Math.max(...rents);

  if (minRent === maxRent) {
    return `From ${formatRent(minRent)} / month`;
  }

  return `${formatRent(minRent)} – ${formatRent(maxRent)} / month`;
}

export default async function AdminRequestDetailPage({
  params,
}: AdminRequestDetailPageProps) {
  const { requestId } = await params;
  const request = await getAvailabilityRequestById(requestId);

  if (!request) {
    notFound();
  }

  const propertySummaries = await getRequestPropertySummaries(
    request.property_codes,
  );
  const { contractLength, message } = parseCustomerInquiryNotes(
    request.additional_notes,
  );
  const showPhotoSharing = isShareEligibleStatus(request.status);
  const [sharePhotos, activeShares] = showPhotoSharing
    ? await Promise.all([
        getPropertyPhotosForShareSelection(request.property_codes),
        getRequestPhotoShares(request.id),
      ])
    : [[], []];

  return (
    <div className="min-h-full bg-white font-sans text-zinc-800">
      <AdminHeader currentPath="/admin/requests" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminPageHeading
          titleMyanmar="တောင်းဆိုချက် အသေးစိတ်"
          titleEnglish="Request Details"
          description={request.request_reference}
        />

        <RequestQuickActions
          phoneNumber={request.phone_number}
          socialContact={request.social_contact}
          propertyIds={request.property_codes}
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Customer Information
              </h2>

              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-zinc-500">Full name</dt>
                  <dd className="mt-1 font-medium text-zinc-900">
                    {request.customer_name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500">Phone</dt>
                  <dd className="mt-1 font-medium text-zinc-900">
                    {request.phone_number}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500">Line ID / contact</dt>
                  <dd className="mt-1 font-medium text-zinc-900">
                    {request.social_contact || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500">Occupants</dt>
                  <dd className="mt-1 font-medium text-zinc-900">
                    {request.number_of_occupants ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500">Budget</dt>
                  <dd className="mt-1 font-medium text-zinc-900">
                    {formatBudget(request.monthly_budget)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-zinc-500">Move-in date</dt>
                  <dd className="mt-1 font-medium text-zinc-900">
                    {request.move_in_date
                      ? formatRequestDate(request.move_in_date)
                      : "—"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-zinc-500">Contract length</dt>
                  <dd className="mt-1 font-medium text-zinc-900">
                    {contractLength || "—"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm text-zinc-500">Message</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-zinc-900">
                    {message || request.additional_notes || "—"}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Shortlisted Properties
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {request.property_codes.length} listing
                {request.property_codes.length === 1 ? "" : "s"} in this request
              </p>

              <div className="mt-4 space-y-4">
                {propertySummaries.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    Property details could not be loaded for:{" "}
                    {request.property_codes.join(", ") || "—"}
                  </p>
                ) : (
                  propertySummaries.map((property) => (
                    <article
                      key={property.propertyId}
                      className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-sm font-semibold text-emerald-700">
                            {formatPublicPropertyReference(property.propertyId)}
                          </p>
                          <p className="mt-1 text-sm text-zinc-600">
                            {property.area || "Area not listed"} ·{" "}
                            {property.transitName || "Station not listed"}
                          </p>
                          <p className="mt-1 text-sm font-medium text-zinc-800">
                            {formatRentRange(property.roomRates)}
                          </p>
                        </div>

                        <Link
                          href={`/admin/properties/${property.propertyId}`}
                          className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-200 bg-white px-3 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                        >
                          Open Property Editor
                        </Link>
                      </div>

                      {property.roomRates.length > 0 ? (
                        <div className="mt-4 overflow-x-auto">
                          <table className="min-w-full text-left text-sm">
                            <thead className="text-zinc-500">
                              <tr>
                                <th className="pb-2 pr-4 font-medium">Room type</th>
                                <th className="pb-2 pr-4 font-medium">Monthly rent</th>
                                <th className="pb-2 font-medium">Size</th>
                              </tr>
                            </thead>
                            <tbody>
                              {property.roomRates.map((roomRate, index) => (
                                <tr key={`${property.propertyId}-${index}`}>
                                  <td className="py-2 pr-4 font-medium text-zinc-800">
                                    {roomRate.roomType || "—"}
                                  </td>
                                  <td className="py-2 pr-4">
                                    {formatRent(roomRate.monthlyRentThb)}
                                  </td>
                                  <td className="py-2">
                                    {roomRate.sizeSqm
                                      ? `${roomRate.sizeSqm} sqm`
                                      : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-zinc-500">
                          No active room rates listed for this property.
                        </p>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>

            {showPhotoSharing ? (
              <CustomerPhotoShareSection
                requestId={request.id}
                propertyIds={request.property_codes}
                photos={sharePhotos}
                activeShares={activeShares}
              />
            ) : (
              <section className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
                <h2 className="text-lg font-semibold text-zinc-900">
                  Customer Photo Sharing
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Photo sharing becomes available after availability is
                  confirmed. Update the request status to Available, Customer
                  Contacted, or Completed to share selected private photos.
                </p>
              </section>
            )}

            <section className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <h2 className="text-lg font-semibold text-amber-900">
                Admin Notes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-amber-800">
                This database table does not include a dedicated internal admin
                notes column. Customer-submitted notes appear above. To track
                internal follow-up notes, add an `admin_notes` column through a
                future migration.
              </p>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                Request Summary
              </h2>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-zinc-500">Reference</dt>
                  <dd className="mt-1 font-mono font-semibold text-emerald-700">
                    {request.request_reference}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Submitted</dt>
                  <dd className="mt-1 font-medium">
                    {formatRequestDate(request.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Preferred area</dt>
                  <dd className="mt-1 font-medium">
                    {request.preferred_area || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Stored status value</dt>
                  <dd className="mt-1 font-mono text-xs text-zinc-700">
                    {request.status}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Workflow label</dt>
                  <dd className="mt-1 font-medium">
                    {STATUS_LABELS[request.status].workflow}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">
                <BilingualLabel
                  myanmar="အခြေအနေ ပြင်ဆင်ရန်"
                  english="Status Workflow"
                />
              </h2>

              <div className="mt-4">
                <RequestStatusControls
                  requestId={request.id}
                  currentStatus={request.status}
                />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
