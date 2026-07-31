/** Client-safe listing display formatters (no server imports). */

export function formatPublicReference(propertyId: string) {
  return `Property ${propertyId}`;
}

export function formatRentThb(value: number | null) {
  if (value === null) {
    return "Rent on request";
  }

  return `฿${value.toLocaleString()}`;
}

export function formatPetFriendly(value: boolean | null) {
  if (value === true) {
    return "Pet friendly";
  }

  if (value === false) {
    return "Not pet friendly";
  }

  return "Pet policy not listed";
}

export function formatRoomTypes(roomTypes: string[]) {
  if (roomTypes.length === 0) {
    return "Room type not listed";
  }

  return roomTypes.join(", ");
}

export function formatSizeSqm(value: number | null) {
  if (value === null) {
    return "Size not listed";
  }

  return `${value} sqm`;
}
