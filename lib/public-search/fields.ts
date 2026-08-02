/** Columns confirmed from admin CRUD usage — do not add unverified fields. */

export const PUBLIC_PROPERTY_COLUMNS =
  "property_id, area, transit_name" as const;

export const PUBLIC_ROOM_RATE_COLUMNS =
  "room_rate_id, property_id, room_type, monthly_rent_thb, size_sqm, floor_options_raw, contract_options_raw, deposit_months_raw, deposit_amount_thb, record_status" as const;

export const PUBLIC_AMENITY_COLUMNS = [
  "property_id",
  "pet_friendly",
  "pool_available",
  "gym_available",
  "balcony_available",
  "lift_available",
  "tm30_available",
  "motorcycle_parking_available",
].join(", ");

export type PublicPropertyRow = {
  property_id: string;
  area: string | null;
  transit_name: string | null;
};

export type PublicRoomRateRow = {
  room_rate_id: string;
  property_id: string;
  room_type: string | null;
  monthly_rent_thb: number | null;
  size_sqm: number | null;
  floor_options_raw: string | null;
  contract_options_raw: string | null;
  deposit_months_raw: string | null;
  deposit_amount_thb: number | null;
  record_status: string | null;
};

export type PublicAmenityRow = {
  property_id: string;
  pet_friendly: boolean | null;
  pool_available: boolean | null;
  gym_available: boolean | null;
  balcony_available: boolean | null;
  lift_available: boolean | null;
  tm30_available: boolean | null;
  motorcycle_parking_available: boolean | null;
};
