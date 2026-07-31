export const BLANK_ROOM_RATE_TEMPLATE: Record<string, unknown> = {
  room_type: "",
  monthly_rent_thb: 0,
  size_sqm: null,
  record_status: "active",
  advance_payment_raw: null,
  contract_options_raw: null,
  daily_rent_raw: null,
  data_quality_status: null,
  deposit_amount_thb: null,
  deposit_months_raw: null,
  extra_details_raw: null,
  floor_options_raw: null,
  source_property_reference: null,
  variant_pet_policy: null,
};

const protectedRoomFields = new Set([
  "room_rate_id",
  "property_id",
  "created_at",
  "updated_at",
]);

export function buildBlankRoomRateTemplate(
  source: Record<string, unknown> | null,
): Record<string, unknown> {
  if (!source) {
    return { ...BLANK_ROOM_RATE_TEMPLATE };
  }

  const blank: Record<string, unknown> = {};

  for (const fieldName of Object.keys(source)) {
    if (protectedRoomFields.has(fieldName)) {
      continue;
    }

    const value = source[fieldName];

    if (fieldName === "record_status") {
      blank[fieldName] = "active";
      continue;
    }

    if (typeof value === "boolean") {
      blank[fieldName] = false;
    } else if (typeof value === "number") {
      blank[fieldName] = 0;
    } else {
      blank[fieldName] = null;
    }
  }

  if (!blank.record_status) {
    blank.record_status = "active";
  }

  return blank;
}
