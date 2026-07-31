import {
  ROOM_RATE_ENUM_DEFAULTS,
  ROOM_RATE_FORM_FIELDS,
  ROOM_RATE_PROTECTED_FIELDS,
} from "@/lib/admin/room-rate-schema";

export const BLANK_ROOM_RATE_TEMPLATE: Record<string, unknown> =
  Object.fromEntries(
    ROOM_RATE_FORM_FIELDS.map((fieldName) => {
      if (fieldName in ROOM_RATE_ENUM_DEFAULTS) {
        return [fieldName, ROOM_RATE_ENUM_DEFAULTS[fieldName]];
      }

      return [fieldName, null];
    }),
  );

export function buildBlankRoomRateTemplate(
  source: Record<string, unknown> | null,
): Record<string, unknown> {
  if (!source) {
    return { ...BLANK_ROOM_RATE_TEMPLATE };
  }

  const blank: Record<string, unknown> = {};

  for (const fieldName of ROOM_RATE_FORM_FIELDS) {
    if (ROOM_RATE_PROTECTED_FIELDS.has(fieldName)) {
      continue;
    }

    if (fieldName in ROOM_RATE_ENUM_DEFAULTS) {
      blank[fieldName] = ROOM_RATE_ENUM_DEFAULTS[fieldName];
      continue;
    }

    blank[fieldName] = null;
  }

  return blank;
}
