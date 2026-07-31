export const REQUEST_STATUSES = [
  "new",
  "contacting_owners",
  "availability_confirmed",
  "viewing_arranged",
  "completed",
  "cancelled",
] as const;

export type AvailabilityRequestStatus = (typeof REQUEST_STATUSES)[number];

export type AvailabilityRequestId = number | string;

export type AvailabilityRequest = {
  id: AvailabilityRequestId;
  request_reference: string;
  customer_name: string;
  phone_number: string;
  social_contact: string | null;
  preferred_area: string | null;
  monthly_budget: number | null;
  move_in_date: string | null;
  number_of_occupants: number | null;
  additional_notes: string | null;
  property_codes: string[];
  status: AvailabilityRequestStatus;
  created_at: string;
};

export const STATUS_LABELS: Record<
  AvailabilityRequestStatus,
  { myanmar: string; english: string; workflow: string }
> = {
  new: { myanmar: "အသစ်", english: "New", workflow: "New" },
  contacting_owners: {
    myanmar: "ပိုင်ရှင်နှင့် ဆက်သွယ်နေ",
    english: "Contacting owners",
    workflow: "Contacting Owner",
  },
  availability_confirmed: {
    myanmar: "ရရှိနိုင်မှု အတည်ပြုပြီး",
    english: "Availability confirmed",
    workflow: "Available",
  },
  viewing_arranged: {
    myanmar: "ဖောက်သည်နှင့် ဆက်သွယ်ပြီး",
    english: "Customer contacted",
    workflow: "Customer Contacted",
  },
  completed: {
    myanmar: "ပြီးမြောက်",
    english: "Completed",
    workflow: "Completed",
  },
  cancelled: {
    myanmar: "ပယ်ဖျက်",
    english: "Cancelled",
    workflow: "Cancelled",
  },
};

export type RequestFilterKey =
  | "all"
  | "new"
  | "in_progress"
  | "confirmed"
  | "unavailable"
  | "completed"
  | "cancelled";

export const REQUEST_FILTER_OPTIONS: Array<{
  key: RequestFilterKey;
  label: string;
  statuses: AvailabilityRequestStatus[] | null;
}> = [
  { key: "all", label: "All", statuses: null },
  { key: "new", label: "New", statuses: ["new"] },
  {
    key: "in_progress",
    label: "In Progress",
    statuses: ["contacting_owners", "viewing_arranged"],
  },
  {
    key: "confirmed",
    label: "Confirmed",
    statuses: ["availability_confirmed"],
  },
  {
    key: "unavailable",
    label: "Unavailable",
    statuses: ["cancelled"],
  },
  {
    key: "completed",
    label: "Completed",
    statuses: ["completed"],
  },
  {
    key: "cancelled",
    label: "Cancelled",
    statuses: ["cancelled"],
  },
];

export function isAvailabilityRequestStatus(
  value: string,
): value is AvailabilityRequestStatus {
  return REQUEST_STATUSES.includes(value as AvailabilityRequestStatus);
}

export function isRequestFilterKey(value: string): value is RequestFilterKey {
  return REQUEST_FILTER_OPTIONS.some((option) => option.key === value);
}

export function getStatusesForFilter(
  filter: RequestFilterKey,
): AvailabilityRequestStatus[] | null {
  const match = REQUEST_FILTER_OPTIONS.find((option) => option.key === filter);
  return match?.statuses ?? null;
}

export function normalizePropertyCodes(value: unknown): string[] {
  if (Array.isArray(value)) {
    return [
      ...new Set(
        value
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    try {
      return normalizePropertyCodes(JSON.parse(trimmed));
    } catch {
      return [trimmed];
    }
  }

  return [];
}

export function normalizeAvailabilityRequest(
  row: Record<string, unknown>,
): AvailabilityRequest {
  return {
    ...(row as AvailabilityRequest),
    property_codes: normalizePropertyCodes(row.property_codes),
  };
}

export function formatPublicPropertyReference(propertyId: string) {
  return `Property ${propertyId}`;
}

export function formatRequestDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatBudget(value: number | null): string {
  if (value === null) {
    return "—";
  }

  return `฿${new Intl.NumberFormat("en-US").format(value)}`;
}

export function parseCustomerInquiryNotes(additionalNotes: string | null) {
  if (!additionalNotes?.trim()) {
    return {
      contractLength: null,
      message: null,
    };
  }

  const contractPrefix = "Intended contract length:";
  const contractIndex = additionalNotes.indexOf(contractPrefix);

  if (contractIndex === 0) {
    const remainder = additionalNotes.slice(contractPrefix.length).trim();
    const splitIndex = remainder.indexOf("\n\n");

    if (splitIndex >= 0) {
      return {
        contractLength: remainder.slice(0, splitIndex).trim() || null,
        message: remainder.slice(splitIndex + 2).trim() || null,
      };
    }

    return {
      contractLength: remainder || null,
      message: null,
    };
  }

  return {
    contractLength: null,
    message: additionalNotes.trim(),
  };
}

export function matchesRequestSearch(
  request: AvailabilityRequest,
  query: string,
): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return (
    request.customer_name.toLowerCase().includes(normalized) ||
    request.phone_number.toLowerCase().includes(normalized) ||
    request.request_reference.toLowerCase().includes(normalized) ||
    request.property_codes.some((code) =>
      code.toLowerCase().includes(normalized),
    ) ||
    (request.social_contact ?? "").toLowerCase().includes(normalized)
  );
}

export function matchesRequestFilter(
  request: AvailabilityRequest,
  filter: RequestFilterKey,
): boolean {
  const statuses = getStatusesForFilter(filter);

  if (!statuses) {
    return true;
  }

  return statuses.includes(request.status);
}
