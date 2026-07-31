"use server";

import { redirect } from "next/navigation";
import { generateRequestReference } from "@/lib/public-inquiry/reference";
import {
  getInquiryListingSummary,
  type InquiryListingSummary,
} from "@/lib/public-inquiry/queries";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";

export type SubmitShortlistRequestState = {
  error: string | null;
};

type SupabaseErrorLike = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

function logAvailabilityRequestError(
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

function parseBudgetValue(value: string): number | null {
  const normalized = value.replace(/[^\d.]/g, "");

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildAdditionalNotes(
  contractLength: string,
  message: string,
): string | null {
  const parts: string[] = [];

  if (contractLength.trim()) {
    parts.push(`Intended contract length: ${contractLength.trim()}`);
  }

  if (message.trim()) {
    parts.push(message.trim());
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join("\n\n");
}

function parsePropertyCodesField(rawValue: string): string[] | null {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null;
    }

    const codes = [
      ...new Set(
        parsed
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ];

    return codes.length > 0 ? codes : null;
  } catch {
    return null;
  }
}

export async function loadShortlistSummariesAction(
  propertyCodes: string[],
): Promise<
  Array<{ propertyId: string; summary: InquiryListingSummary | null }>
> {
  const uniqueCodes = [
    ...new Set(propertyCodes.map((code) => code.trim()).filter(Boolean)),
  ];

  return Promise.all(
    uniqueCodes.map(async (propertyId) => ({
      propertyId,
      summary: await getInquiryListingSummary(propertyId),
    })),
  );
}

export async function submitShortlistRequestAction(
  _previousState: SubmitShortlistRequestState,
  formData: FormData,
): Promise<SubmitShortlistRequestState> {
  const honeypot = String(formData.get("company_website") ?? "").trim();

  if (honeypot) {
    redirect("/shortlist/success?ref=received");
  }

  const propertyCodes = parsePropertyCodesField(
    String(formData.get("property_codes") ?? ""),
  );
  const customerName = String(formData.get("customer_name") ?? "").trim();
  const phoneNumber = String(formData.get("phone_number") ?? "").trim();
  const socialContact = String(formData.get("social_contact") ?? "").trim();
  const preferredArea = String(formData.get("preferred_area") ?? "").trim();
  const moveInDate = String(formData.get("move_in_date") ?? "").trim();
  const contractLength = String(formData.get("contract_length") ?? "").trim();
  const occupantsRaw = String(formData.get("number_of_occupants") ?? "").trim();
  const budgetRaw = String(formData.get("monthly_budget") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const availabilityAcknowledged =
    formData.get("availability_acknowledged") === "on";
  const viewingPolicyAcknowledged =
    formData.get("viewing_policy_acknowledged") === "on";

  if (!propertyCodes || propertyCodes.length === 0) {
    return { error: "Select at least one property before submitting." };
  }

  const listings = await Promise.all(
    propertyCodes.map((code) => getInquiryListingSummary(code)),
  );

  if (listings.some((listing) => !listing)) {
    console.error("Shortlist submission rejected unknown property codes:", {
      submittedPropertyCodes: propertyCodes,
      validatedPropertyCodes: listings.map((listing, index) => ({
        submitted: propertyCodes[index],
        found: Boolean(listing),
      })),
    });

    return {
      error:
        "One or more selected listings could not be found. Please search again and re-add them to your shortlist.",
    };
  }

  const validatedPropertyCodes = listings.map(
    (listing) => listing!.propertyId,
  );

  if (!customerName) {
    return { error: "Full name is required." };
  }

  if (!phoneNumber) {
    return { error: "Phone number is required." };
  }

  if (!socialContact) {
    return { error: "Line ID or preferred contact is required." };
  }

  if (!preferredArea) {
    return { error: "Preferred area is required." };
  }

  if (!moveInDate) {
    return { error: "Preferred move-in date is required." };
  }

  if (!availabilityAcknowledged) {
    return {
      error:
        "Please confirm that availability must be verified with the property owner.",
    };
  }

  if (!viewingPolicyAcknowledged) {
    return {
      error: "Please confirm that you understand the viewing policy.",
    };
  }

  const parsedOccupants = Number(occupantsRaw);

  if (
    !occupantsRaw ||
    !Number.isInteger(parsedOccupants) ||
    parsedOccupants <= 0
  ) {
    return {
      error: "Number of occupants must be a whole number greater than zero.",
    };
  }

  const monthlyBudget = parseBudgetValue(budgetRaw);

  if (monthlyBudget === null || monthlyBudget <= 0) {
    return { error: "Budget must be a valid positive number." };
  }

  const requestReference = generateRequestReference();

  let supabase;

  try {
    supabase = createAdminServiceClient();
  } catch (error) {
    console.error("Shortlist submission service client unavailable:", error);
    return {
      error:
        "We could not submit your request right now. Please try again in a moment.",
    };
  }

  const insertPayload = {
    request_reference: requestReference,
    customer_name: customerName,
    phone_number: phoneNumber,
    social_contact: socialContact,
    preferred_area: preferredArea,
    monthly_budget: monthlyBudget,
    move_in_date: moveInDate,
    number_of_occupants: parsedOccupants,
    additional_notes: buildAdditionalNotes(contractLength, message),
    property_codes: validatedPropertyCodes,
    availability_acknowledged: true,
    viewing_policy_acknowledged: true,
    status: "new" as const,
  };

  const { error } = await supabase
    .from("availability_requests")
    .insert(insertPayload);

  if (error) {
    logAvailabilityRequestError("Shortlist request submission failed:", error, {
      propertyCodeCount: validatedPropertyCodes.length,
    });
    return {
      error:
        "We could not submit your request right now. Please try again in a moment.",
    };
  }

  redirect(
    `/shortlist/success?ref=${encodeURIComponent(requestReference)}&propertyIds=${encodeURIComponent(validatedPropertyCodes.join(","))}`,
  );
}
