"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BLANK_ROOM_RATE_TEMPLATE } from "@/lib/admin/room-rate-fields";
import { requireAdmin } from "@/lib/supabase/server";

const protectedRoomRateFields = new Set([
  "room_rate_id",
  "property_id",
  "created_at",
  "updated_at",
]);

type RoomRateValues = Record<string, string | number | boolean | null>;

type SupabaseErrorLike = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

function logRoomRateError(
  context: string,
  error: SupabaseErrorLike,
  metadata?: Record<string, unknown>,
) {
  console.error(context, {
    message: error.message ?? null,
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
    ...metadata,
  });
}

function revalidatePropertyPaths(propertyId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
}

function getNextRoomRateId(
  highestId: string | number | null | undefined,
): string | number {
  if (highestId === null || highestId === undefined) {
    return 1;
  }

  if (typeof highestId === "number") {
    return highestId + 1;
  }

  const idString = String(highestId);
  const numericValue = Number(idString);

  if (!Number.isNaN(numericValue) && String(numericValue) === idString) {
    return numericValue + 1;
  }

  const trailingMatch = idString.match(/^(.*?)(\d+)$/);

  if (trailingMatch) {
    const [, prefix, digits] = trailingMatch;
    const nextNumber = Number(digits) + 1;

    return `${prefix}${String(nextNumber).padStart(digits.length, "0")}`;
  }

  throw new Error("Could not generate the next room rate ID.");
}

function getNextRoomRateIdForProperty(
  propertyId: string,
  highestId: string | number | null | undefined,
): string {
  if (highestId === null || highestId === undefined) {
    return `${propertyId}-RATE-001`;
  }

  return String(getNextRoomRateId(highestId));
}

function parseFieldValue(
  fieldName: string,
  currentValue: unknown,
  rawValue: string,
): string | number | boolean | null {
  if (rawValue === "") {
    if (fieldName === "record_status") {
      return "active";
    }

    return null;
  }

  if (typeof currentValue === "boolean") {
    return rawValue === "true";
  }

  if (typeof currentValue === "number") {
    const numericValue = Number(rawValue);

    if (Number.isNaN(numericValue)) {
      throw new Error(`${fieldName} must be a valid number.`);
    }

    return numericValue;
  }

  return rawValue;
}

function parseRoomRateUpdates(
  currentRoomRate: Record<string, unknown>,
  formData: FormData,
): RoomRateValues {
  const updates: RoomRateValues = {};

  for (const [fieldName, currentValue] of Object.entries(currentRoomRate)) {
    if (protectedRoomRateFields.has(fieldName)) {
      continue;
    }

    if (!formData.has(fieldName)) {
      continue;
    }

    const rawValue = String(formData.get(fieldName) ?? "").trim();
    updates[fieldName] = parseFieldValue(fieldName, currentValue, rawValue);
  }

  return updates;
}

function parseRoomRateInsert(
  template: Record<string, unknown>,
  formData: FormData,
): RoomRateValues {
  const insert: RoomRateValues = {};

  for (const [fieldName, currentValue] of Object.entries(template)) {
    if (protectedRoomRateFields.has(fieldName)) {
      continue;
    }

    const rawValue = formData.has(fieldName)
      ? String(formData.get(fieldName) ?? "").trim()
      : "";

    insert[fieldName] = parseFieldValue(fieldName, currentValue, rawValue);
  }

  if (!insert.record_status) {
    insert.record_status = "active";
  }

  return insert;
}

export async function updateRoomRateAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();
  const roomRateId = String(formData.get("room_rate_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  if (!roomRateId) {
    throw new Error("Room rate ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { data: currentRoomRate, error: loadError } = await supabase
    .from("room_rates")
    .select("*")
    .eq("room_rate_id", roomRateId)
    .eq("property_id", propertyId)
    .single();

  if (loadError || !currentRoomRate) {
    logRoomRateError("Failed to load room rate before update", loadError ?? {}, {
      propertyId,
      roomRateId,
    });
    throw new Error("Room rate could not be loaded.");
  }

  const updates = parseRoomRateUpdates(currentRoomRate, formData);

  const { error: updateError } = await supabase
    .from("room_rates")
    .update(updates)
    .eq("room_rate_id", roomRateId)
    .eq("property_id", propertyId);

  if (updateError) {
    logRoomRateError("Failed to update room rate", updateError, {
      propertyId,
      roomRateId,
    });
    throw new Error("Room rate update failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?roomSaved=1`);
}

export async function createRoomRateAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("property_id")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (propertyError || !property) {
    logRoomRateError(
      "Failed to load property before room creation",
      propertyError ?? {},
      { propertyId },
    );
    redirect(`/admin/properties/${propertyId}?roomError=1`);
  }

  const [
    { data: highestRoomRate, error: highestError },
    { data: propertyRoomRate },
    { data: anyRoomRate },
  ] = await Promise.all([
    supabase
      .from("room_rates")
      .select("room_rate_id")
      .eq("property_id", propertyId)
      .order("room_rate_id", { ascending: false })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("room_rates")
      .select("*")
      .eq("property_id", propertyId)
      .limit(1)
      .maybeSingle(),

    supabase.from("room_rates").select("*").limit(1).maybeSingle(),
  ]);

  if (highestError) {
    logRoomRateError("Failed to load highest room rate ID", highestError, {
      propertyId,
    });
    redirect(`/admin/properties/${propertyId}?roomError=1`);
  }

  const template = (propertyRoomRate ??
    anyRoomRate ??
    BLANK_ROOM_RATE_TEMPLATE) as Record<string, unknown>;

  let nextRoomRateId: string;

  try {
    nextRoomRateId = getNextRoomRateIdForProperty(
      propertyId,
      highestRoomRate?.room_rate_id,
    );
  } catch (error) {
    console.error("Failed to generate room rate ID:", {
      propertyId,
      highestRoomRateId: highestRoomRate?.room_rate_id ?? null,
      message: error instanceof Error ? error.message : String(error),
    });
    redirect(`/admin/properties/${propertyId}?roomError=1`);
  }

  let insertValues: RoomRateValues;

  try {
    insertValues = parseRoomRateInsert(template, formData);
  } catch (error) {
    console.error("Failed to parse new room rate form:", {
      propertyId,
      message: error instanceof Error ? error.message : String(error),
    });
    redirect(`/admin/properties/${propertyId}?roomError=1`);
  }

  const insert: RoomRateValues = {
    property_id: propertyId,
    room_rate_id: nextRoomRateId,
    ...insertValues,
    record_status: insertValues.record_status ?? "active",
  };

  const { error: insertError } = await supabase.from("room_rates").insert(insert);

  if (insertError) {
    logRoomRateError("Failed to create room rate", insertError, {
      propertyId,
      roomRateId: nextRoomRateId,
    });
    redirect(`/admin/properties/${propertyId}?roomError=1`);
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?roomCreated=1`);
}

export async function deleteRoomRateAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();
  const roomRateId = String(formData.get("room_rate_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  if (!roomRateId) {
    throw new Error("Room rate ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { error: deleteError } = await supabase
    .from("room_rates")
    .delete()
    .eq("room_rate_id", roomRateId)
    .eq("property_id", propertyId);

  if (deleteError) {
    logRoomRateError("Failed to delete room rate", deleteError, {
      propertyId,
      roomRateId,
    });
    throw new Error("Room rate deletion failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?roomDeleted=1`);
}
