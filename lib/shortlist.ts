export const SHORTLIST_STORAGE_KEY = "ayesayrent-shortlist";
export const SHORTLIST_CHANGE_EVENT = "ayesayrent-shortlist-change";
export const SHORTLIST_SELECTION_SEPARATOR = "|";

export type ShortlistSelection = {
  propertyId: string;
  roomRateId: string;
};

export function encodeShortlistSelection(
  propertyId: string,
  roomRateId: string,
): string {
  return `${propertyId.trim()}${SHORTLIST_SELECTION_SEPARATOR}${roomRateId.trim()}`;
}

export function parseShortlistSelection(
  value: string,
): ShortlistSelection | null {
  const trimmed = value.trim();

  if (!trimmed.includes(SHORTLIST_SELECTION_SEPARATOR)) {
    return null;
  }

  const [propertyId, roomRateId] = trimmed.split(
    SHORTLIST_SELECTION_SEPARATOR,
    2,
  );

  if (!propertyId?.trim() || !roomRateId?.trim()) {
    return null;
  }

  return {
    propertyId: propertyId.trim(),
    roomRateId: roomRateId.trim(),
  };
}

export function readShortlist(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeShortlist(codes: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const uniqueCodes = [...new Set(codes.map((code) => code.trim()).filter(Boolean))];
  window.localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(uniqueCodes));
  window.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE_EVENT));
}

export function addToShortlist(propertyId: string, roomRateId: string): void {
  const key = encodeShortlistSelection(propertyId, roomRateId);
  const current = readShortlist();

  if (current.includes(key)) {
    return;
  }

  writeShortlist([...current, key]);
}

export function removeFromShortlist(selectionKey: string): void {
  writeShortlist(readShortlist().filter((item) => item !== selectionKey));
}

export function clearShortlist(): void {
  writeShortlist([]);
}

export function isInShortlist(propertyId: string, roomRateId: string): boolean {
  return readShortlist().includes(
    encodeShortlistSelection(propertyId, roomRateId),
  );
}
