import {
  PUBLIC_AMENITY_BOOLEAN_FIELDS,
  type PublicAmenityField,
} from "@/lib/public-search/amenity-labels";

export function getPublicAmenityLabels(
  amenities: Partial<Record<PublicAmenityField, boolean | null>>,
): string[] {
  const labels: string[] = [];

  for (const field of PUBLIC_AMENITY_BOOLEAN_FIELDS) {
    if (amenities[field] === true) {
      labels.push(AMENITY_LABELS[field]);
    }
  }

  return labels;
}

const AMENITY_LABELS: Record<PublicAmenityField, string> = {
  pool_available: "Swimming pool",
  gym_available: "Fitness room",
  balcony_available: "Balcony",
  lift_available: "Lift",
  tm30_available: "TM30 support",
  motorcycle_parking_available: "Motorcycle parking",
};
