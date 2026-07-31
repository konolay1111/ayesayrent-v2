"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";

const protectedNearbyFields = new Set(["property_id", "updated_at"]);

type NearbyValues = Record<string, string | number | boolean | null>;

function revalidatePropertyPaths(propertyId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function updateNearbyAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { data: currentNearby, error: loadError } = await supabase
    .from("nearby")
    .select("*")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (loadError || !currentNearby) {
    console.error("Failed to load nearby information before update:", loadError);
    throw new Error("Nearby information could not be loaded.");
  }

  const updates: NearbyValues = {};

  for (const [fieldName, currentValue] of Object.entries(currentNearby)) {
    if (protectedNearbyFields.has(fieldName)) {
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

  const { error: updateError } = await supabase
    .from("nearby")
    .update(updates)
    .eq("property_id", propertyId);

  if (updateError) {
    console.error("Failed to update nearby information:", updateError);
    throw new Error("Nearby information update failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?nearbySaved=1`);
}
