/** room_rates columns confirmed from database samples and insert tests. */

export const ROOM_RATE_NUMERIC_FIELDS = new Set([
  "monthly_rent_thb",
  "size_sqm",
  "deposit_amount_thb",
]);

export const ROOM_RATE_ENUM_DEFAULTS: Record<string, string> = {
  record_status: "active",
  data_quality_status: "needs_review",
};

export const ROOM_RATE_DATA_QUALITY_VALUES = ["needs_review", "ready"] as const;

export const ROOM_RATE_PROTECTED_FIELDS = new Set([
  "room_rate_id",
  "property_id",
  "created_at",
  "updated_at",
]);

export const ROOM_RATE_FORM_FIELDS = [
  "room_type",
  "size_sqm",
  "variant_pet_policy",
  "floor_options_raw",
  "contract_options_raw",
  "monthly_rent_thb",
  "deposit_months_raw",
  "deposit_amount_thb",
  "advance_payment_raw",
  "extra_details_raw",
  "daily_rent_raw",
  "source_property_reference",
  "record_status",
  "data_quality_status",
] as const;

export function isRoomRateNumericField(fieldName: string) {
  return ROOM_RATE_NUMERIC_FIELDS.has(fieldName);
}

export function normalizeRoomRateEnumValue(
  fieldName: string,
  rawValue: string,
): string | null {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return ROOM_RATE_ENUM_DEFAULTS[fieldName] ?? null;
  }

  if (fieldName === "data_quality_status") {
    if (
      !ROOM_RATE_DATA_QUALITY_VALUES.includes(
        trimmed as (typeof ROOM_RATE_DATA_QUALITY_VALUES)[number],
      )
    ) {
      throw new Error(
        "Data quality status must be needs_review or ready.",
      );
    }
  }

  return trimmed;
}

export function normalizeRoomRateNumericValue(
  fieldName: string,
  rawValue: string,
): number | null {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return null;
  }

  const numericValue = Number(trimmed);

  if (Number.isNaN(numericValue)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  return numericValue;
}

export function parseRoomRateFormValue(
  fieldName: string,
  rawValue: string,
): string | number | boolean | null {
  if (fieldName in ROOM_RATE_ENUM_DEFAULTS) {
    return normalizeRoomRateEnumValue(fieldName, rawValue);
  }

  if (isRoomRateNumericField(fieldName)) {
    return normalizeRoomRateNumericValue(fieldName, rawValue);
  }

  const trimmed = rawValue.trim();
  return trimmed === "" ? null : trimmed;
}

export function buildRoomRateInsertPayload(
  propertyId: string,
  roomRateId: string,
  values: Record<string, string | number | boolean | null>,
): Record<string, string | number | boolean | null> {
  const insert: Record<string, string | number | boolean | null> = {
    property_id: propertyId,
    room_rate_id: roomRateId,
    record_status:
      (values.record_status as string | null | undefined) ??
      ROOM_RATE_ENUM_DEFAULTS.record_status,
    data_quality_status:
      (values.data_quality_status as string | null | undefined) ??
      ROOM_RATE_ENUM_DEFAULTS.data_quality_status,
  };

  for (const fieldName of ROOM_RATE_FORM_FIELDS) {
    if (fieldName === "record_status" || fieldName === "data_quality_status") {
      continue;
    }

    const value = values[fieldName];

    if (value !== null && value !== undefined) {
      insert[fieldName] = value;
    }
  }

  return insert;
}
