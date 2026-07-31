"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";

const protectedAmenityFields = new Set(["property_id", "updated_at"]);

const amenityBooleanFields = new Set([
  "motorcycle_parking_available",
  "pool_available",
  "gym_available",
  "balcony_available",
  "lift_available",
  "tm30_available",
  "pet_friendly",
]);

const amenityNumericFields = new Set([
  "motorcycle_parking_fee_thb",
  "pool_fee_thb",
  "gym_fee_thb",
  "pet_fee_thb",
]);

type AmenityValues = Record<string, string | number | boolean | null>;

function revalidatePropertyPaths(propertyId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function updateAmenityAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { data: currentAmenity, error: loadError } = await supabase
    .from("amenities")
    .select("*")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (loadError || !currentAmenity) {
    console.error("Failed to load amenities before update:", loadError);
    throw new Error("Amenities could not be loaded.");
  }

  const updates: AmenityValues = {};

  for (const [fieldName, currentValue] of Object.entries(currentAmenity)) {
    if (protectedAmenityFields.has(fieldName)) {
      continue;
    }

    if (!formData.has(fieldName)) {
      continue;
    }

    const rawValue = String(formData.get(fieldName) ?? "").trim();

    if (amenityBooleanFields.has(fieldName)) {
      updates[fieldName] = rawValue === "true";
      continue;
    }

    if (rawValue === "") {
      updates[fieldName] = null;
      continue;
    }

    if (
      amenityNumericFields.has(fieldName) ||
      typeof currentValue === "number"
    ) {
      const numericValue = Number(rawValue);

      if (Number.isNaN(numericValue)) {
        throw new Error(`${fieldName} must be a valid number.`);
      }

      updates[fieldName] = numericValue;
      continue;
    }

    if (typeof currentValue === "boolean") {
      updates[fieldName] = rawValue === "true";
      continue;
    }

    updates[fieldName] = rawValue;
  }

  const { error: updateError } = await supabase
    .from("amenities")
    .update(updates)
    .eq("property_id", propertyId);

  if (updateError) {
    console.error("Failed to update amenities:", updateError);
    throw new Error("Amenities update failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?amenitiesSaved=1`);
}
