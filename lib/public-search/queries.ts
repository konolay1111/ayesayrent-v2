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
  PublicSearchFilters,
  SearchFilterOptions,
} from "@/lib/public-search/types";

const INACTIVE_RECORD_STATUSES = new Set([
  "inactive",
  "archived",
  "deleted",
  "draft",
]);

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
  formatPublicReference,
  formatPetFriendly,
  formatRentThb,
  formatRoomTypes,
  formatSizeSqm,
} from "@/lib/public-search/format";

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select(PUBLIC_PROPERTY_COLUMNS)
    .order("area")
    .order("transit_name");

  if (error) {
    console.error("Failed to load public search filter options:", error.message);
    return { areas: [], stationsByArea: {}, allStations: [] };
  }

  const properties = (data ?? []) as unknown as PublicPropertyRow[];
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
  const supabase = await createClient();

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
    console.error("Public property search failed:", propertyError.message);
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
    console.error("Public room rate search failed:", roomRateError.message);
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

  const groupedMatches = new Map<
    string,
    {
      property: PublicPropertyRow;
      rooms: PublicRoomRateRow[];
      amenity: PublicAmenityRow | undefined;
    }
  >();

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

    const existing = groupedMatches.get(roomRate.property_id);

    if (existing) {
      existing.rooms.push(roomRate);
      continue;
    }

    groupedMatches.set(roomRate.property_id, {
      property,
      rooms: [roomRate],
      amenity,
    });
  }

  const results = [...groupedMatches.values()]
    .map(({ property, rooms, amenity }) => {
      const sortedRooms = [...rooms].sort(
        (left, right) =>
          (left.monthly_rent_thb ?? Number.MAX_SAFE_INTEGER) -
          (right.monthly_rent_thb ?? Number.MAX_SAFE_INTEGER),
      );
      const bestRoom = sortedRooms[0];
      const roomTypes = [
        ...new Set(
          sortedRooms
            .map((room) => room.room_type?.trim())
            .filter((roomType): roomType is string => Boolean(roomType)),
        ),
      ];

      return {
        propertyId: property.property_id,
        publicReference: formatPublicReference(property.property_id),
        area: property.area,
        transitName: property.transit_name,
        lowestMonthlyRent: bestRoom?.monthly_rent_thb ?? null,
        matchingRoomTypes: roomTypes,
        sizeSqm: bestRoom?.size_sqm ?? null,
        petFriendly: amenity?.pet_friendly ?? null,
        amenities: amenity ? getPublicAmenityLabels(amenity) : [],
      } satisfies PublicListingResult;
    })
    .sort((left, right) => {
      const leftRent = left.lowestMonthlyRent ?? Number.MAX_SAFE_INTEGER;
      const rightRent = right.lowestMonthlyRent ?? Number.MAX_SAFE_INTEGER;

      if (leftRent !== rightRent) {
        return leftRent - rightRent;
      }

      return left.propertyId.localeCompare(right.propertyId);
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
