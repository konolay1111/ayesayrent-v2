"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  buildRoomRateInsertPayload,
  parseRoomRateFormValue,
  ROOM_RATE_FORM_FIELDS,
  ROOM_RATE_PROTECTED_FIELDS,
} from "@/lib/admin/room-rate-schema";
import { requireAdmin } from "@/lib/supabase/server";

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

function parseRoomRateFormData(formData: FormData): RoomRateValues {
  const values: RoomRateValues = {};

  for (const fieldName of ROOM_RATE_FORM_FIELDS) {
    if (!formData.has(fieldName)) {
      continue;
    }

    const rawValue = String(formData.get(fieldName) ?? "");
    values[fieldName] = parseRoomRateFormValue(fieldName, rawValue);
  }

  return values;
}

function parseRoomRateUpdates(
  currentRoomRate: Record<string, unknown>,
  formData: FormData,
): RoomRateValues {
  const updates: RoomRateValues = {};

  for (const fieldName of Object.keys(currentRoomRate)) {
    if (ROOM_RATE_PROTECTED_FIELDS.has(fieldName)) {
      continue;
    }

    if (!formData.has(fieldName)) {
      continue;
    }

    const rawValue = String(formData.get(fieldName) ?? "");
    updates[fieldName] = parseRoomRateFormValue(fieldName, rawValue);
  }

  return updates;
}

export async function updateRoomRateAction(
  propertyId: string,
  formData: FormData,
) {
  const normalizedPropertyId = propertyId.trim();
  const roomRateId = String(formData.get("room_rate_id") ?? "").trim();

  if (!normalizedPropertyId) {
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
    .eq("property_id", normalizedPropertyId)
    .single();

  if (loadError || !currentRoomRate) {
    logRoomRateError("Failed to load room rate before update", loadError ?? {}, {
      propertyId: normalizedPropertyId,
      roomRateId,
    });
    throw new Error("Room rate could not be loaded.");
  }

  let updates: RoomRateValues;

  try {
    updates = parseRoomRateUpdates(currentRoomRate, formData);
  } catch (error) {
    console.error("Failed to parse room rate update form:", {
      propertyId: normalizedPropertyId,
      roomRateId,
      message: error instanceof Error ? error.message : String(error),
    });
    throw new Error(
      error instanceof Error ? error.message : "Room rate update failed.",
    );
  }

  const { error: updateError } = await supabase
    .from("room_rates")
    .update(updates)
    .eq("room_rate_id", roomRateId)
    .eq("property_id", normalizedPropertyId);

  if (updateError) {
    logRoomRateError("Failed to update room rate", updateError, {
      propertyId: normalizedPropertyId,
      roomRateId,
      updates,
    });
    throw new Error("Room rate update failed.");
  }

  revalidatePropertyPaths(normalizedPropertyId);

  redirect(`/admin/properties/${normalizedPropertyId}?roomSaved=1`);
}

export async function createRoomRateAction(
  propertyId: string,
  formData: FormData,
) {
  const normalizedPropertyId = propertyId.trim();

  if (!normalizedPropertyId) {
    throw new Error("Property ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("property_id")
    .eq("property_id", normalizedPropertyId)
    .maybeSingle();

  if (propertyError || !property) {
    logRoomRateError(
      "Failed to load property before room creation",
      propertyError ?? {},
      { propertyId: normalizedPropertyId },
    );
    redirect(`/admin/properties/${normalizedPropertyId}?roomError=1`);
  }

  const { data: highestRoomRate, error: highestError } = await supabase
    .from("room_rates")
    .select("room_rate_id")
    .eq("property_id", normalizedPropertyId)
    .order("room_rate_id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (highestError) {
    logRoomRateError("Failed to load highest room rate ID", highestError, {
      propertyId: normalizedPropertyId,
    });
    redirect(`/admin/properties/${normalizedPropertyId}?roomError=1`);
  }

  let nextRoomRateId: string;

  try {
    nextRoomRateId = getNextRoomRateIdForProperty(
      normalizedPropertyId,
      highestRoomRate?.room_rate_id,
    );
  } catch (error) {
    console.error("Failed to generate room rate ID:", {
      propertyId: normalizedPropertyId,
      highestRoomRateId: highestRoomRate?.room_rate_id ?? null,
      message: error instanceof Error ? error.message : String(error),
    });
    redirect(`/admin/properties/${normalizedPropertyId}?roomError=1`);
  }

  let formValues: RoomRateValues;

  try {
    formValues = parseRoomRateFormData(formData);
  } catch (error) {
    console.error("Failed to parse new room rate form:", {
      propertyId: normalizedPropertyId,
      message: error instanceof Error ? error.message : String(error),
    });
    redirect(`/admin/properties/${normalizedPropertyId}?roomError=1`);
  }

  const insert = buildRoomRateInsertPayload(
    normalizedPropertyId,
    nextRoomRateId,
    formValues,
  );

  const { error: insertError } = await supabase.from("room_rates").insert(insert);

  if (insertError) {
    logRoomRateError("Failed to create room rate", insertError, {
      propertyId: normalizedPropertyId,
      roomRateId: nextRoomRateId,
      insertPayload: insert,
    });
    redirect(`/admin/properties/${normalizedPropertyId}?roomError=1`);
  }

  revalidatePropertyPaths(normalizedPropertyId);

  redirect(`/admin/properties/${normalizedPropertyId}?roomCreated=1`);
}

export async function deleteRoomRateAction(
  propertyId: string,
  formData: FormData,
) {
  const normalizedPropertyId = propertyId.trim();
  const roomRateId = String(formData.get("room_rate_id") ?? "").trim();

  if (!normalizedPropertyId) {
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
    .eq("property_id", normalizedPropertyId);

  if (deleteError) {
    logRoomRateError("Failed to delete room rate", deleteError, {
      propertyId: normalizedPropertyId,
      roomRateId,
    });
    throw new Error("Room rate deletion failed.");
  }

  revalidatePropertyPaths(normalizedPropertyId);

  redirect(`/admin/properties/${normalizedPropertyId}?roomDeleted=1`);
}
