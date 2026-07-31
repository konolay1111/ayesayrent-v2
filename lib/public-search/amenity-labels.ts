export const PUBLIC_AMENITY_BOOLEAN_FIELDS = [
  "pool_available",
  "gym_available",
  "balcony_available",
  "lift_available",
  "tm30_available",
  "motorcycle_parking_available",
] as const;

export type PublicAmenityField = (typeof PUBLIC_AMENITY_BOOLEAN_FIELDS)[number];
