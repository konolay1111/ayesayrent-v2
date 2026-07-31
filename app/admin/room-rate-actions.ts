"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";

const protectedRoomRateFields = new Set([
  "room_rate_id",
  "property_id",
  "created_at",
  "updated_at",
]);

type RoomRateValues = Record<string, string | number | boolean | null>;

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

    if (rawValue === "") {
      updates[fieldName] = null;
      continue;
    }

    if (typeof currentValue === "boolean") {
      updates[fieldName] = rawValue === "true";
      continue;
    }

    if (typeof currentValue === "number") {
      const numericValue = Number(rawValue);

      if (Number.isNaN(numericValue)) {
        throw new Error(`${fieldName} must be a valid number.`);
      }

      updates[fieldName] = numericValue;
      continue;
    }

    updates[fieldName] = rawValue;
  }

  return updates;
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
    console.error("Failed to load room rate before update:", loadError);
    throw new Error("Room rate could not be loaded.");
  }

  const updates = parseRoomRateUpdates(currentRoomRate, formData);

  const { error: updateError } = await supabase
    .from("room_rates")
    .update(updates)
    .eq("room_rate_id", roomRateId)
    .eq("property_id", propertyId);

  if (updateError) {
    console.error("Failed to update room rate:", updateError);
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
    console.error("Failed to load property before room creation:", propertyError);
    throw new Error("Property could not be loaded.");
  }

  const [
    { data: highestRoomRate, error: highestError },
    { data: propertyRoomRate },
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
  ]);

  if (highestError) {
    console.error("Failed to load highest room rate ID:", highestError);
    throw new Error("Room rate ID could not be generated.");
  }

  let template = propertyRoomRate;

  if (!template) {
    const { data: anyRoomRate } = await supabase
      .from("room_rates")
      .select("*")
      .limit(1)
      .maybeSingle();

    template = anyRoomRate;
  }

  const nextRoomRateId = getNextRoomRateId(highestRoomRate?.room_rate_id);

  const insert: RoomRateValues = {
    property_id: propertyId,
    room_rate_id: nextRoomRateId,
  };

  if (template) {
    for (const [fieldName, value] of Object.entries(template)) {
      if (protectedRoomRateFields.has(fieldName)) {
        continue;
      }

      if (typeof value === "boolean") {
        insert[fieldName] = false;
      } else if (typeof value === "number") {
        insert[fieldName] = 0;
      } else {
        insert[fieldName] = null;
      }
    }
  }

  const { error: insertError } = await supabase.from("room_rates").insert(insert);

  if (insertError) {
    console.error("Failed to create room rate:", insertError);
    throw new Error("Room rate creation failed.");
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
    console.error("Failed to delete room rate:", deleteError);
    throw new Error("Room rate deletion failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?roomDeleted=1`);
}
