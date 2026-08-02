/** Client-safe listing display formatters (no server imports). */

export function formatPublicReference(propertyId: string) {
  return `Property ${propertyId}`;
}

export function buildPropertyDetailHref(
  propertyId: string,
  roomRateId?: string | null,
) {
  const base = `/property/${encodeURIComponent(propertyId.trim())}`;

  if (!roomRateId?.trim()) {
    return base;
  }

  const params = new URLSearchParams();
  params.set("roomRate", roomRateId.trim());
  return `${base}?${params.toString()}`;
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

export function formatRoomType(value: string | null) {
  if (!value?.trim()) {
    return "Room type not listed";
  }

  return value.trim();
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

export function formatFloor(value: string | null) {
  if (!value?.trim()) {
    return "Floor not listed";
  }

  return value.trim();
}

export function formatContract(value: string | null) {
  if (!value?.trim()) {
    return "Contract not listed";
  }

  return value.trim();
}

export function formatDeposit(
  depositMonthsRaw: string | null,
  depositAmountThb: number | null,
) {
  const parts: string[] = [];

  if (depositMonthsRaw?.trim()) {
    parts.push(depositMonthsRaw.trim());
  }

  if (depositAmountThb !== null) {
    parts.push(`฿${depositAmountThb.toLocaleString()}`);
  }

  if (parts.length === 0) {
    return "Deposit not listed";
  }

  return parts.join(" • ");
}
