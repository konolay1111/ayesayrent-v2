import type { AvailabilityRequestStatus } from "@/lib/admin/requests";

export const SHARE_ELIGIBLE_STATUSES: AvailabilityRequestStatus[] = [
  "availability_confirmed",
  "viewing_arranged",
  "completed",
];

export const SHARE_EXPIRATION_OPTIONS = [
  { key: "24h", label: "24 hours", hours: 24 },
  { key: "3d", label: "3 days", hours: 72 },
  { key: "7d", label: "7 days", hours: 168 },
] as const;

export type ShareExpirationKey = (typeof SHARE_EXPIRATION_OPTIONS)[number]["key"];

export const CUSTOMER_SIGNED_URL_EXPIRY_SECONDS = 20 * 60;

export function isShareEligibleStatus(status: AvailabilityRequestStatus) {
  return SHARE_ELIGIBLE_STATUSES.includes(status);
}

export function isShareExpirationKey(value: string): value is ShareExpirationKey {
  return SHARE_EXPIRATION_OPTIONS.some((option) => option.key === value);
}

export function getShareExpirationHours(key: ShareExpirationKey) {
  const match = SHARE_EXPIRATION_OPTIONS.find((option) => option.key === key);
  return match?.hours ?? null;
}
