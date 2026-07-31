export type PetFilter = "all" | "yes" | "no";

export type PublicSearchFilters = {
  area: string;
  station: string;
  minRent: number | null;
  maxRent: number | null;
  pet: PetFilter;
};

export type PublicListingResult = {
  propertyId: string;
  publicReference: string;
  area: string | null;
  transitName: string | null;
  lowestMonthlyRent: number | null;
  matchingRoomTypes: string[];
  sizeSqm: number | null;
  petFriendly: boolean | null;
  amenities: string[];
};

export type SearchFilterOptions = {
  areas: string[];
  stationsByArea: Record<string, string[]>;
  allStations: string[];
};
