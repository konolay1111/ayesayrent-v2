"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isAvailabilityRequestStatus,
  type AvailabilityRequestStatus,
} from "@/lib/admin/requests";
import { parseAvailabilityRequestId } from "@/lib/admin/request-ids";
import {
  createClient,
  lookupAdminUser,
  requireAdmin,
} from "@/lib/supabase/server";

export type SignInState = {
  error: string | null;
};

export async function signInAction(
  _previousState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error:
        "အီးမေးလ်နှင့် စကားဝှက် ထည့်သွင်းရန် လိုအပ်ပါသည်။ Please enter your email and password.",
    };
  }

  const supabase = await createClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      error:
        "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။ Invalid email or password.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(
      "Failed to retrieve authenticated user after sign-in:",
      userError,
    );

    await supabase.auth.signOut();

    return {
      error:
        "ဝင်ရောက်မှု မအောင်မြင်ပါ။ ခဏနောက် ထပ်မံကြိုးစားပါ။ Sign-in could not be completed. Please try again.",
    };
  }

  const { data: adminUser, error: adminError } = await lookupAdminUser(
    supabase,
    user.id,
  );

  if (adminError) {
    console.error("Admin authorization check failed:", adminError);

    await supabase.auth.signOut();

    return {
      error:
        "ဝင်ရောက်မှု မအောင်မြင်ပါ။ ခဏနောက် ထပ်မံကြိုးစားပါ။ Sign-in could not be completed. Please try again.",
    };
  }

  if (!adminUser) {
    await supabase.auth.signOut();

    return {
      error:
        "ဤအကောင့်တွင် အက်ဒမင် ခွင့်ပြုချက် မရှိပါ။ This account has no access.",
    };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/admin/login");
}

export type UpdateStatusState = {
  error: string | null;
  success: boolean;
};

export async function updateRequestStatusAction(
  requestId: unknown,
  status: AvailabilityRequestStatus,
): Promise<UpdateStatusState> {
  const normalizedRequestId = parseAvailabilityRequestId(requestId);

  if (!normalizedRequestId || !isAvailabilityRequestStatus(status)) {
    return {
      error: "Invalid request or status.",
      success: false,
    };
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("availability_requests")
    .update({ status })
    .eq("id", normalizedRequestId);

  if (error) {
    console.error("Failed to update request status:", error);

    return {
      error: "Status update failed. Please try again.",
      success: false,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${normalizedRequestId}`);

  return {
    error: null,
    success: true,
  };
}

export async function updatePropertyAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const { supabase } = await requireAdmin();

  const { data: currentProperty, error: loadError } = await supabase
    .from("properties")
    .select("*")
    .eq("property_id", propertyId)
    .single();

  if (loadError || !currentProperty) {
    console.error("Failed to load property before update:", loadError);
    throw new Error("Property could not be loaded.");
  }

  const protectedFields = new Set([
    "property_id",
    "id",
    "created_at",
    "updated_at",
  ]);

  const updates: Record<string, string | number | boolean | null> = {};

  for (const [fieldName, currentValue] of Object.entries(currentProperty)) {
    if (protectedFields.has(fieldName)) {
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

  const { error: updateError } = await supabase
    .from("properties")
    .update(updates)
    .eq("property_id", propertyId);

  if (updateError) {
    console.error("Failed to update property:", updateError);
    throw new Error("Property update failed.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);

  redirect(`/admin/properties/${propertyId}?saved=1`);
}