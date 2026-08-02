import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { createClient } from "@/lib/supabase/server";
import { getPublicAmenityLabels } from "@/lib/public-search/amenity-display";
import { formatPublicReference } from "@/lib/public-search/format";
import {
  PUBLIC_AMENITY_COLUMNS,
  PUBLIC_PROPERTY_COLUMNS,
  PUBLIC_ROOM_RATE_COLUMNS,
  type PublicAmenityRow,
  type PublicPropertyRow,
  type PublicRoomRateRow,
} from "@/lib/public-search/fields";
import type {
  PetFilter,
  PublicListingResult,
  PublicPropertyDetail,
  PublicRoomRateOption,
  PublicSearchFilters,
  SearchFilterOptions,
} from "@/lib/public-search/types";

const INACTIVE_RECORD_STATUSES = new Set([
  "inactive",
  "archived",
  "deleted",
  "draft",
]);

type SupabaseErrorLike = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

function logPublicSearchError(
  context: string,
  error: SupabaseErrorLike,
  metadata?: Record<string, unknown>,
) {
  console.error(context, {
    message: error.message ?? null,
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
    ...metadata,
  });
}

async function createPublicSearchSupabaseClient() {
  try {
    return createAdminServiceClient();
  } catch (error) {
    console.error("Public search admin service client unavailable:", {
      message: error instanceof Error ? error.message : String(error),
    });
    return createClient();
  }
}

export function parseSearchFilters(searchParams: {
  area?: string;
  station?: string;
  minRent?: string;
  maxRent?: string;
  pet?: string;
}): PublicSearchFilters {
  const minRentRaw = searchParams.minRent?.trim() ?? "";
  const maxRentRaw = searchParams.maxRent?.trim() ?? "";
  const minRent = minRentRaw ? Number(minRentRaw) : null;
  const maxRent = maxRentRaw ? Number(maxRentRaw) : null;

  let pet: PetFilter = "all";
  if (searchParams.pet === "true" || searchParams.pet === "yes") {
    pet = "yes";
  } else if (searchParams.pet === "false" || searchParams.pet === "no") {
    pet = "no";
  }

  return {
    area: searchParams.area?.trim() ?? "",
    station: searchParams.station?.trim() ?? "",
    minRent: minRent !== null && Number.isFinite(minRent) ? minRent : null,
    maxRent: maxRent !== null && Number.isFinite(maxRent) ? maxRent : null,
    pet,
  };
}

export {
  buildPropertyDetailHref,
  formatPublicReference,
  formatPetFriendly,
  formatRentThb,
  formatRoomType,
  formatRoomTypes,
  formatSizeSqm,
  formatFloor,
  formatContract,
  formatDeposit,
} from "@/lib/public-search/format";

function toPublicRoomRateOption(
  roomRate: PublicRoomRateRow,
): PublicRoomRateOption {
  return {
    roomRateId: roomRate.room_rate_id,
    roomType: roomRate.room_type,
    monthlyRent: roomRate.monthly_rent_thb,
    sizeSqm: roomRate.size_sqm,
    floorOptionsRaw: roomRate.floor_options_raw,
    contractOptionsRaw: roomRate.contract_options_raw,
    depositMonthsRaw: roomRate.deposit_months_raw,
    depositAmountThb: roomRate.deposit_amount_thb,
  };
}

function sortRoomRatesByRent(roomRates: PublicRoomRateRow[]) {
  return [...roomRates].sort(
    (left, right) =>
      (left.monthly_rent_thb ?? Number.MAX_SAFE_INTEGER) -
      (right.monthly_rent_thb ?? Number.MAX_SAFE_INTEGER),
  );
}

function resolveSelectedRoomRate(
  roomRates: PublicRoomRateRow[],
  requestedRoomRateId?: string | null,
): {
  selectedRoomRate: PublicRoomRateOption;
  selectedRoomRateIsFallback: boolean;
} {
  const sortedRoomRates = sortRoomRatesByRent(roomRates);
  const fallbackRoomRate = sortedRoomRates[0];

  if (!fallbackRoomRate) {
    throw new Error("Property has no usable room rates.");
  }

  const trimmedRequestedRoomRateId = requestedRoomRateId?.trim();

  if (trimmedRequestedRoomRateId) {
    const matchedRoomRate = roomRates.find(
      (roomRate) => roomRate.room_rate_id === trimmedRequestedRoomRateId,
    );

    if (matchedRoomRate) {
      return {
        selectedRoomRate: toPublicRoomRateOption(matchedRoomRate),
        selectedRoomRateIsFallback: false,
      };
    }
  }

  return {
    selectedRoomRate: toPublicRoomRateOption(fallbackRoomRate),
    selectedRoomRateIsFallback: Boolean(trimmedRequestedRoomRateId),
  };
}

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

function roomRateMatchesRent(
  roomRate: PublicRoomRateRow,
  filters: PublicSearchFilters,
) {
  const rent = roomRate.monthly_rent_thb;

  if (rent === null) {
    return false;
  }

  if (filters.minRent !== null && rent < filters.minRent) {
    return false;
  }

  if (filters.maxRent !== null && rent > filters.maxRent) {
    return false;
  }

  return true;
}

function amenityMatchesPet(
  amenity: PublicAmenityRow | undefined,
  pet: PetFilter,
) {
  if (pet === "all") {
    return true;
  }

  if (pet === "yes") {
    return amenity?.pet_friendly === true;
  }

  return amenity?.pet_friendly === false;
}

export async function getSearchFilterOptions(): Promise<SearchFilterOptions> {
  const supabase = await createPublicSearchSupabaseClient();

  const { data, error } = await supabase
    .from("properties")
    .select(PUBLIC_PROPERTY_COLUMNS)
    .order("area")
    .order("transit_name");

  if (error) {
    logPublicSearchError("Failed to load public search filter options", error);
    return { areas: [], stationsByArea: {}, allStations: [] };
  }

  const properties = (data ?? []) as unknown as PublicPropertyRow[];

  if (properties.length === 0) {
    console.warn("Public search filter options query returned zero properties.");
  }
  const areaSet = new Set<string>();
  const stationSet = new Set<string>();
  const stationsByArea: Record<string, Set<string>> = {};

  for (const property of properties) {
    const area = property.area?.trim();
    const station = property.transit_name?.trim();

    if (area) {
      areaSet.add(area);

      if (station) {
        if (!stationsByArea[area]) {
          stationsByArea[area] = new Set<string>();
        }
        stationsByArea[area].add(station);
      }
    }

    if (station) {
      stationSet.add(station);
    }
  }

  const normalizedStationsByArea: Record<string, string[]> = {};

  for (const [area, stations] of Object.entries(stationsByArea)) {
    normalizedStationsByArea[area] = [...stations].sort((a, b) =>
      a.localeCompare(b),
    );
  }

  return {
    areas: [...areaSet].sort((a, b) => a.localeCompare(b)),
    stationsByArea: normalizedStationsByArea,
    allStations: [...stationSet].sort((a, b) => a.localeCompare(b)),
  };
}

export async function searchPublicListings(
  filters: PublicSearchFilters,
): Promise<{ results: PublicListingResult[]; error: string | null }> {
  const supabase = await createPublicSearchSupabaseClient();

  let propertyQuery = supabase
    .from("properties")
    .select(PUBLIC_PROPERTY_COLUMNS)
    .order("property_id");

  if (filters.area) {
    propertyQuery = propertyQuery.eq("area", filters.area);
  }

  if (filters.station) {
    propertyQuery = propertyQuery.eq("transit_name", filters.station);
  }

  const { data: propertyData, error: propertyError } = await propertyQuery;

  if (propertyError) {
    logPublicSearchError("Public property search failed", propertyError, {
      filters,
    });
    return {
      results: [],
      error: "We could not load search results right now. Please try again.",
    };
  }

  const properties = (propertyData ?? []) as unknown as PublicPropertyRow[];

  if (properties.length === 0) {
    return { results: [], error: null };
  }

  const propertyIds = properties.map((property) => property.property_id);

  const [{ data: roomRateData, error: roomRateError }, { data: amenityData }] =
    await Promise.all([
      supabase
        .from("room_rates")
        .select(PUBLIC_ROOM_RATE_COLUMNS)
        .in("property_id", propertyIds),
      supabase
        .from("amenities")
        .select(PUBLIC_AMENITY_COLUMNS)
        .in("property_id", propertyIds),
    ]);

  if (roomRateError) {
    logPublicSearchError("Public room rate search failed", roomRateError, {
      propertyCount: propertyIds.length,
    });
    return {
      results: [],
      error: "We could not load search results right now. Please try again.",
    };
  }

  const roomRates = ((roomRateData ?? []) as unknown as PublicRoomRateRow[]).filter(
    isUsableRoomRate,
  );
  const amenitiesByProperty = new Map<string, PublicAmenityRow>();

  for (const amenity of (amenityData ?? []) as unknown as PublicAmenityRow[]) {
    amenitiesByProperty.set(amenity.property_id, amenity);
  }

  const propertyById = new Map(
    properties.map((property) => [property.property_id, property]),
  );

  const results: PublicListingResult[] = [];

  for (const roomRate of roomRates) {
    if (!roomRateMatchesRent(roomRate, filters)) {
      continue;
    }

    const property = propertyById.get(roomRate.property_id);

    if (!property) {
      continue;
    }

    const amenity = amenitiesByProperty.get(roomRate.property_id);

    if (!amenityMatchesPet(amenity, filters.pet)) {
      continue;
    }

    results.push({
      propertyId: property.property_id,
      roomRateId: roomRate.room_rate_id,
      publicReference: formatPublicReference(property.property_id),
      area: property.area,
      transitName: property.transit_name,
      monthlyRent: roomRate.monthly_rent_thb,
      roomType: roomRate.room_type,
      sizeSqm: roomRate.size_sqm,
      floorOptionsRaw: roomRate.floor_options_raw,
      contractOptionsRaw: roomRate.contract_options_raw,
      depositMonthsRaw: roomRate.deposit_months_raw,
      depositAmountThb: roomRate.deposit_amount_thb,
      petFriendly: amenity?.pet_friendly ?? null,
      amenities: amenity ? getPublicAmenityLabels(amenity) : [],
    });
  }

  results.sort((left, right) => {
    const leftRent = left.monthlyRent ?? Number.MAX_SAFE_INTEGER;
    const rightRent = right.monthlyRent ?? Number.MAX_SAFE_INTEGER;

    if (leftRent !== rightRent) {
      return leftRent - rightRent;
    }

    const propertyCompare = left.propertyId.localeCompare(right.propertyId);

    if (propertyCompare !== 0) {
      return propertyCompare;
    }

    return left.roomRateId.localeCompare(right.roomRateId);
  });

  return { results, error: null };
}

export function buildSearchQueryString(filters: PublicSearchFilters) {
  const params = new URLSearchParams();

  if (filters.area) {
    params.set("area", filters.area);
  }

  if (filters.station) {
    params.set("station", filters.station);
  }

  if (filters.minRent !== null) {
    params.set("minRent", String(filters.minRent));
  }

  if (filters.maxRent !== null) {
    params.set("maxRent", String(filters.maxRent));
  }

  if (filters.pet === "yes") {
    params.set("pet", "true");
  } else if (filters.pet === "no") {
    params.set("pet", "false");
  }

  return params.toString();
}

export async function getPublicPropertyDetail(
  propertyId: string,
  requestedRoomRateId?: string | null,
): Promise<PublicPropertyDetail | null> {
  const trimmedPropertyId = propertyId.trim();

  if (!trimmedPropertyId) {
    return null;
  }

  const supabase = await createPublicSearchSupabaseClient();

  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select(PUBLIC_PROPERTY_COLUMNS)
    .eq("property_id", trimmedPropertyId)
    .maybeSingle();

  if (propertyError) {
    logPublicSearchError("Public property detail load failed", propertyError, {
      propertyId: trimmedPropertyId,
    });
    return null;
  }

  const property = propertyData as PublicPropertyRow | null;

  if (!property) {
    return null;
  }

  const [{ data: roomRateData }, { data: amenityData }] = await Promise.all([
    supabase
      .from("room_rates")
      .select(PUBLIC_ROOM_RATE_COLUMNS)
      .eq("property_id", trimmedPropertyId),
    supabase
      .from("amenities")
      .select(PUBLIC_AMENITY_COLUMNS)
      .eq("property_id", trimmedPropertyId)
      .maybeSingle(),
  ]);

  const roomRates = ((roomRateData ?? []) as unknown as PublicRoomRateRow[]).filter(
    isUsableRoomRate,
  );

  if (roomRates.length === 0) {
    return null;
  }

  const amenity = amenityData as PublicAmenityRow | null;
  const { selectedRoomRate, selectedRoomRateIsFallback } = resolveSelectedRoomRate(
    roomRates,
    requestedRoomRateId,
  );

  const selectedRow = roomRates.find(
    (roomRate) => roomRate.room_rate_id === selectedRoomRate.roomRateId,
  );

  if (
    selectedRow &&
    selectedRow.property_id.trim() !== trimmedPropertyId
  ) {
    return null;
  }

  return {
    propertyId: property.property_id,
    publicReference: formatPublicReference(property.property_id),
    area: property.area,
    transitName: property.transit_name,
    petFriendly: amenity?.pet_friendly ?? null,
    amenities: amenity ? getPublicAmenityLabels(amenity) : [],
    roomRates: sortRoomRatesByRent(roomRates).map(toPublicRoomRateOption),
    selectedRoomRate,
    selectedRoomRateIsFallback,
  };
}

export async function getSimilarPublicListings(
  propertyId: string,
  roomRateId: string,
  area: string,
  limit = 3,
): Promise<PublicListingResult[]> {
  const { results } = await searchPublicListings({
    area,
    station: "",
    minRent: null,
    maxRent: null,
    pet: "all",
  });

  return results
    .filter(
      (listing) =>
        !(
          listing.propertyId === propertyId &&
          listing.roomRateId === roomRateId
        ),
    )
    .slice(0, limit);
}
