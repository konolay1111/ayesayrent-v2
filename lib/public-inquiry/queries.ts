import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import {
  formatFloor,
  formatPublicReference,
  formatRentThb,
  formatRoomType,
  formatSizeSqm,
} from "@/lib/public-search/format";
import {
  PUBLIC_PROPERTY_COLUMNS,
  PUBLIC_ROOM_RATE_COLUMNS,
  type PublicPropertyRow,
  type PublicRoomRateRow,
} from "@/lib/public-search/fields";
import { parseShortlistSelection } from "@/lib/shortlist";

const INACTIVE_RECORD_STATUSES = new Set([
  "inactive",
  "archived",
  "deleted",
  "draft",
]);

export type InquiryListingSummary = {
  propertyId: string;
  roomRateId: string;
  publicReference: string;
  area: string | null;
  transitName: string | null;
  monthlyRent: number | null;
  roomType: string | null;
  sizeSqm: number | null;
  floorOptionsRaw: string | null;
  displayLabel: string;
};

function isUsableRoomRate(roomRate: PublicRoomRateRow) {
  if (
    roomRate.monthly_rent_thb === null ||
    roomRate.monthly_rent_thb <= 0
  ) {
    return false;
  }

  if (!roomRate.record_status) {
    return true;
  }

  return !INACTIVE_RECORD_STATUSES.has(
    roomRate.record_status.trim().toLowerCase(),
  );
}

function buildDisplayLabel(summary: {
  publicReference: string;
  roomRateId: string;
  monthlyRent: number | null;
  roomType: string | null;
  sizeSqm: number | null;
  floorOptionsRaw: string | null;
}) {
  return [
    summary.publicReference,
    summary.roomRateId,
    formatRentThb(summary.monthlyRent),
    formatRoomType(summary.roomType),
    formatSizeSqm(summary.sizeSqm),
    formatFloor(summary.floorOptionsRaw),
  ].join(" • ");
}

export async function getInquiryListingSummary(
  selectionKey: string,
): Promise<InquiryListingSummary | null> {
  const parsedSelection = parseShortlistSelection(selectionKey);
  const propertyId = parsedSelection?.propertyId ?? selectionKey.trim();
  const roomRateId = parsedSelection?.roomRateId ?? null;

  if (!propertyId) {
    return null;
  }

  const supabase = createAdminServiceClient();

  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select(PUBLIC_PROPERTY_COLUMNS)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (propertyError) {
    console.error("Failed to load inquiry listing property:", {
      message: propertyError.message,
      code: propertyError.code,
      details: propertyError.details,
      hint: propertyError.hint,
      propertyId,
      roomRateId,
    });
    return null;
  }

  const property = propertyData as PublicPropertyRow | null;

  if (!property) {
    return null;
  }

  const { data: roomRateData, error: roomRateError } = await supabase
    .from("room_rates")
    .select(PUBLIC_ROOM_RATE_COLUMNS)
    .eq("property_id", propertyId);

  if (roomRateError) {
    console.error("Failed to load inquiry listing room rates:", {
      message: roomRateError.message,
      code: roomRateError.code,
      details: roomRateError.details,
      hint: roomRateError.hint,
      propertyId,
      roomRateId,
    });
  }

  const usableRoomRates = ((roomRateData ?? []) as unknown as PublicRoomRateRow[]).filter(
    isUsableRoomRate,
  );

  if (usableRoomRates.length === 0) {
    return null;
  }

  const selectedRoomRate =
    (roomRateId
      ? usableRoomRates.find((roomRate) => roomRate.room_rate_id === roomRateId)
      : null) ??
    [...usableRoomRates].sort(
      (left, right) =>
        (left.monthly_rent_thb ?? Number.MAX_SAFE_INTEGER) -
        (right.monthly_rent_thb ?? Number.MAX_SAFE_INTEGER),
    )[0];

  if (!selectedRoomRate) {
    return null;
  }

  const summary = {
    propertyId: property.property_id,
    roomRateId: selectedRoomRate.room_rate_id,
    publicReference: formatPublicReference(property.property_id),
    area: property.area,
    transitName: property.transit_name,
    monthlyRent: selectedRoomRate.monthly_rent_thb,
    roomType: selectedRoomRate.room_type,
    sizeSqm: selectedRoomRate.size_sqm,
    floorOptionsRaw: selectedRoomRate.floor_options_raw,
    displayLabel: "",
  };

  return {
    ...summary,
    displayLabel: buildDisplayLabel(summary),
  };
}
