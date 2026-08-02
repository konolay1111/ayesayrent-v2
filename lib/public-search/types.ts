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
  roomRateId: string;
  publicReference: string;
  area: string | null;
  transitName: string | null;
  monthlyRent: number | null;
  roomType: string | null;
  sizeSqm: number | null;
  floorOptionsRaw: string | null;
  contractOptionsRaw: string | null;
  depositMonthsRaw: string | null;
  depositAmountThb: number | null;
  petFriendly: boolean | null;
  amenities: string[];
};

export type SearchFilterOptions = {
  areas: string[];
  stationsByArea: Record<string, string[]>;
  allStations: string[];
};

export type PublicRoomRateOption = {
  roomRateId: string;
  roomType: string | null;
  monthlyRent: number | null;
  sizeSqm: number | null;
  floorOptionsRaw: string | null;
  contractOptionsRaw: string | null;
  depositMonthsRaw: string | null;
  depositAmountThb: number | null;
};

export type PublicPropertyDetail = {
  propertyId: string;
  publicReference: string;
  area: string | null;
  transitName: string | null;
  petFriendly: boolean | null;
  amenities: string[];
  roomRates: PublicRoomRateOption[];
  selectedRoomRate: PublicRoomRateOption;
  selectedRoomRateIsFallback: boolean;
};
