const RENT_TEXT_PREFIX_PATTERN = /^[\s฿$]+/;

export function parseRentFilterValue(
  value: string | undefined,
): number | null {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.replace(/,/g, "");
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

export function normalizeMonthlyRentThb(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const withoutPrefix = trimmed.replace(RENT_TEXT_PREFIX_PATTERN, "");
    const normalized = withoutPrefix.replace(/,/g, "");
    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}
