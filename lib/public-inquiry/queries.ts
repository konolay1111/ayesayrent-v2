import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { formatPublicReference } from "@/lib/public-search/queries";
import {
  PUBLIC_PROPERTY_COLUMNS,
  PUBLIC_ROOM_RATE_COLUMNS,
  type PublicPropertyRow,
  type PublicRoomRateRow,
} from "@/lib/public-search/fields";

const INACTIVE_RECORD_STATUSES = new Set([
  "inactive",
  "archived",
  "deleted",
  "draft",
]);

export type InquiryListingSummary = {
  propertyId: string;
  publicReference: string;
  area: string | null;
  transitName: string | null;
  startingMonthlyRent: number | null;
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

export async function getInquiryListingSummary(
  propertyId: string,
): Promise<InquiryListingSummary | null> {
  const trimmedPropertyId = propertyId.trim();

  if (!trimmedPropertyId) {
    return null;
  }

  const supabase = createAdminServiceClient();

  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select(PUBLIC_PROPERTY_COLUMNS)
    .eq("property_id", trimmedPropertyId)
    .maybeSingle();

  if (propertyError) {
    console.error("Failed to load inquiry listing property:", {
      message: propertyError.message,
      code: propertyError.code,
      details: propertyError.details,
      hint: propertyError.hint,
      propertyId: trimmedPropertyId,
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
    .eq("property_id", trimmedPropertyId);

  if (roomRateError) {
    console.error("Failed to load inquiry listing room rates:", {
      message: roomRateError.message,
      code: roomRateError.code,
      details: roomRateError.details,
      hint: roomRateError.hint,
      propertyId: trimmedPropertyId,
    });
  }

  const usableRoomRates = ((roomRateData ?? []) as unknown as PublicRoomRateRow[]).filter(
    isUsableRoomRate,
  );

  const startingMonthlyRent =
    usableRoomRates.length > 0
      ? Math.min(
          ...usableRoomRates.map(
            (roomRate) => roomRate.monthly_rent_thb as number,
          ),
        )
      : null;

  return {
    propertyId: property.property_id,
    publicReference: formatPublicReference(property.property_id),
    area: property.area,
    transitName: property.transit_name,
    startingMonthlyRent,
  };
}
