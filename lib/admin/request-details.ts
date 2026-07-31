import { requireAdmin } from "@/lib/supabase/server";
import {
  PUBLIC_PROPERTY_COLUMNS,
  PUBLIC_ROOM_RATE_COLUMNS,
  type PublicPropertyRow,
  type PublicRoomRateRow,
} from "@/lib/public-search/fields";
import { parseAvailabilityRequestId } from "@/lib/admin/request-ids";
import {
  normalizeAvailabilityRequest,
  type AvailabilityRequest,
} from "@/lib/admin/requests";

const INACTIVE_RECORD_STATUSES = new Set([
  "inactive",
  "archived",
  "deleted",
  "draft",
]);

export type RequestPropertySummary = {
  propertyId: string;
  area: string | null;
  transitName: string | null;
  roomRates: Array<{
    roomType: string | null;
    monthlyRentThb: number | null;
    sizeSqm: number | null;
    recordStatus: string | null;
  }>;
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

export async function getAvailabilityRequestById(requestId: unknown) {
  const normalizedRequestId = parseAvailabilityRequestId(requestId);

  if (!normalizedRequestId) {
    return null;
  }

  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("availability_requests")
    .select("*")
    .eq("id", normalizedRequestId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load availability request:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeAvailabilityRequest(data as Record<string, unknown>);
}

export async function getRequestPropertySummaries(
  propertyIds: string[],
): Promise<RequestPropertySummary[]> {
  const uniquePropertyIds = [...new Set(propertyIds.map((id) => id.trim()))].filter(
    Boolean,
  );

  if (uniquePropertyIds.length === 0) {
    return [];
  }

  const { supabase } = await requireAdmin();

  const [{ data: propertyData, error: propertyError }, { data: roomRateData }] =
    await Promise.all([
      supabase
        .from("properties")
        .select(PUBLIC_PROPERTY_COLUMNS)
        .in("property_id", uniquePropertyIds),
      supabase
        .from("room_rates")
        .select(PUBLIC_ROOM_RATE_COLUMNS)
        .in("property_id", uniquePropertyIds)
        .order("monthly_rent_thb", { ascending: true }),
    ]);

  if (propertyError) {
    console.error(
      "Failed to load request property summaries:",
      propertyError.message,
    );
    return [];
  }

  const properties = (propertyData ?? []) as unknown as PublicPropertyRow[];
  const roomRates = (roomRateData ?? []) as unknown as PublicRoomRateRow[];

  return uniquePropertyIds.map((propertyId) => {
    const property = properties.find((item) => item.property_id === propertyId);
    const propertyRoomRates = roomRates
      .filter((roomRate) => roomRate.property_id === propertyId)
      .filter(isUsableRoomRate);

    return {
      propertyId,
      area: property?.area ?? null,
      transitName: property?.transit_name ?? null,
      roomRates: propertyRoomRates.map((roomRate) => ({
        roomType: roomRate.room_type,
        monthlyRentThb: roomRate.monthly_rent_thb,
        sizeSqm: roomRate.size_sqm,
        recordStatus: roomRate.record_status,
      })),
    };
  });
}
