/**
 * availability_requests.id is PostgreSQL BIGINT.
 * Keep it as a numeric string — never convert to JavaScript Number.
 */

export function normalizeAvailabilityRequestId(value: unknown): string {
  return String(value ?? "").trim();
}

export function isValidAvailabilityRequestId(value: string): boolean {
  return /^\d+$/.test(value);
}

export function parseAvailabilityRequestId(
  value: unknown,
): string | null {
  const normalized = normalizeAvailabilityRequestId(value);

  if (!isValidAvailabilityRequestId(normalized)) {
    return null;
  }

  return normalized;
}

export function normalizePhotoId(value: unknown): string {
  return String(value ?? "").trim();
}

export function normalizePropertyId(value: unknown): string {
  return String(value ?? "").trim();
}

export function normalizeShareId(value: unknown): string {
  return String(value ?? "").trim();
}
