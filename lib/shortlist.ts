export const SHORTLIST_STORAGE_KEY = "ayesayrent-shortlist";
export const SHORTLIST_CHANGE_EVENT = "ayesayrent-shortlist-change";

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

  const uniqueCodes = [...new Set(codes)];
  window.localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(uniqueCodes));
  window.dispatchEvent(new CustomEvent(SHORTLIST_CHANGE_EVENT));
}

export function addToShortlist(code: string): void {
  const current = readShortlist();
  if (current.includes(code)) {
    return;
  }
  writeShortlist([...current, code]);
}

export function removeFromShortlist(code: string): void {
  writeShortlist(readShortlist().filter((item) => item !== code));
}

export function isInShortlist(code: string): boolean {
  return readShortlist().includes(code);
}
