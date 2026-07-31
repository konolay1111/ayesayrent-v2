import Link from "next/link";
import {
  AdminHeader,
  AdminPageHeading,
} from "@/components/admin/AdminHeader";
import { formatPublicPropertyReference } from "@/lib/admin/requests";
import { requireAdmin } from "@/lib/supabase/server";

const INACTIVE_RECORD_STATUSES = new Set([
  "inactive",
  "archived",
  "deleted",
  "draft",
]);

type PropertyListRow = {
  property_id: string;
  area: string | null;
  transit_name: string | null;
};

type RoomRateStatusRow = {
  property_id: string;
  record_status: string | null;
};

function getPropertyStatusLabel(roomRates: RoomRateStatusRow[]) {
  if (roomRates.length === 0) {
    return "No room rates";
  }

  const hasActiveRoom = roomRates.some((roomRate) => {
    if (!roomRate.record_status) {
      return true;
    }

    return !INACTIVE_RECORD_STATUSES.has(
      roomRate.record_status.trim().toLowerCase(),
    );
  });

  return hasActiveRoom ? "Active" : "Inactive";
}

export default async function AdminPropertiesPage() {
  const { supabase } = await requireAdmin();

  const [{ data: properties, error }, { data: roomRates, error: roomRatesError }] =
    await Promise.all([
      supabase
        .from("properties")
        .select("property_id, area, transit_name")
        .order("property_id"),
      supabase.from("room_rates").select("property_id, record_status"),
    ]);

  if (error) {
    console.error("Failed to load properties:", error);
  }

  if (roomRatesError) {
    console.error("Failed to load room rate statuses:", roomRatesError);
  }

  const roomRatesByProperty = new Map<string, RoomRateStatusRow[]>();

  for (const roomRate of (roomRates ?? []) as RoomRateStatusRow[]) {
    const existing = roomRatesByProperty.get(roomRate.property_id) ?? [];
    existing.push(roomRate);
    roomRatesByProperty.set(roomRate.property_id, existing);
  }

  const propertyRows = (properties ?? []) as PropertyListRow[];

  return (
    <div className="min-h-full bg-white font-sans text-zinc-800">
      <AdminHeader currentPath="/admin/properties" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminPageHeading
          titleMyanmar="ပိုင်ဆိုင်မှုများ"
          titleEnglish="Properties"
          description="Manage property records, room rates, and private photos."
        />

        <div className="mb-6 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
          Total: {propertyRows.length}
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Property reference</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium">BTS/MRT</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {propertyRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      No properties found.
                    </td>
                  </tr>
                ) : (
                  propertyRows.map((property) => {
                    const statusLabel = getPropertyStatusLabel(
                      roomRatesByProperty.get(property.property_id) ?? [],
                    );

                    return (
                      <tr
                        key={property.property_id}
                        className="border-t border-zinc-100"
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-emerald-700">
                          {formatPublicPropertyReference(property.property_id)}
                        </td>
                        <td className="px-4 py-3 text-zinc-800">
                          {property.area || "—"}
                        </td>
                        <td className="px-4 py-3 text-zinc-800">
                          {property.transit_name || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              statusLabel === "Active"
                                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                                : statusLabel === "Inactive"
                                  ? "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200"
                                  : "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={`/admin/properties/${property.property_id}`}
                            className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-200 bg-white px-3 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
