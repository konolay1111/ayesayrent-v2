"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";

const protectedFeeFields = new Set(["property_id", "updated_at"]);

type FeeValues = Record<string, string | number | boolean | null>;

function revalidatePropertyPaths(propertyId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
}

export async function updateFeeAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { data: currentFees, error: loadError } = await supabase
    .from("fees")
    .select("*")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (loadError || !currentFees) {
    console.error("Failed to load fees before update:", loadError);
    throw new Error("Fees could not be loaded.");
  }

  const updates: FeeValues = {};

  for (const [fieldName, currentValue] of Object.entries(currentFees)) {
    if (protectedFeeFields.has(fieldName)) {
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
    .from("fees")
    .update(updates)
    .eq("property_id", propertyId);

  if (updateError) {
    console.error("Failed to update fees:", updateError);
    throw new Error("Fees update failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?feesSaved=1`);
}
