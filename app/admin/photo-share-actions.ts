"use server";

import { revalidatePath } from "next/cache";
import {
  getShareExpirationHours,
  isShareExpirationKey,
  isShareEligibleStatus,
} from "@/lib/customer-photo-share/constants";
import {
  buildSharePath,
  generateShareToken,
  hashShareToken,
} from "@/lib/customer-photo-share/tokens";
import {
  normalizePhotoId,
  normalizePropertyId,
  normalizeShareId,
  parseAvailabilityRequestId,
} from "@/lib/admin/request-ids";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { requireAdmin } from "@/lib/supabase/server";
import type { AvailabilityRequestStatus } from "@/lib/admin/requests";
import { normalizePropertyCodes } from "@/lib/admin/requests";
import { resolveSiteOrigin } from "@/lib/site/url";

export type CreatePhotoShareState = {
  error: string | null;
  success: boolean;
  shareUrl: string | null;
};

export type RevokePhotoShareState = {
  error: string | null;
  success: boolean;
};

async function buildAbsoluteShareUrl(token: string) {
  const origin = await resolveSiteOrigin();

  if (!origin) {
    return buildSharePath(token);
  }

  return `${origin}${buildSharePath(token)}`;
}

async function loadRequestForShare(
  supabase: ReturnType<typeof createAdminServiceClient>,
  requestId: string,
) {
  const { data, error } = await supabase
    .from("availability_requests")
    .select("id, status, property_codes")
    .eq("id", requestId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id as number | string,
    status: data.status as AvailabilityRequestStatus,
    property_codes: normalizePropertyCodes(data.property_codes),
  };
}

async function validateSelectedPhotos(
  supabase: ReturnType<typeof createAdminServiceClient>,
  propertyId: string,
  photoIds: string[],
) {
  const { data, error } = await supabase
    .from("property_photos")
    .select("photo_id, storage_path")
    .eq("property_id", propertyId)
    .in("photo_id", photoIds);

  if (error) {
    console.error("Failed to validate selected photos:", error.message);
    return null;
  }

  const rows = data ?? [];

  if (rows.length !== photoIds.length) {
    return null;
  }

  const validRows = rows.filter(
    (row) =>
      typeof row.storage_path === "string" && row.storage_path.trim().length > 0,
  );

  if (validRows.length !== photoIds.length) {
    return null;
  }

  return validRows.map((row) => normalizePhotoId(row.photo_id)).filter(Boolean);
}

export async function createCustomerPhotoShareAction(
  requestId: unknown,
  propertyId: unknown,
  photoIds: unknown[],
  expirationKey: string,
): Promise<CreatePhotoShareState> {
  const emptyResult = (error: string): CreatePhotoShareState => ({
    error,
    success: false,
    shareUrl: null,
  });

  const normalizedRequestId = parseAvailabilityRequestId(requestId);

  if (!normalizedRequestId) {
    return emptyResult("Invalid request reference.");
  }

  const normalizedPropertyId = normalizePropertyId(propertyId);

  if (!normalizedPropertyId) {
    return emptyResult("Request and property are required.");
  }

  if (!isShareExpirationKey(expirationKey)) {
    return emptyResult("Choose a valid expiration period.");
  }

  const uniquePhotoIds = [
    ...new Set(
      photoIds.map((id) => normalizePhotoId(id)).filter(Boolean),
    ),
  ];

  if (uniquePhotoIds.length === 0) {
    return emptyResult("Select at least one photo.");
  }

  const expirationHours = getShareExpirationHours(expirationKey);

  if (!expirationHours) {
    return emptyResult("Choose a valid expiration period.");
  }

  const { user } = await requireAdmin();
  const supabase = createAdminServiceClient();

  const request = await loadRequestForShare(supabase, normalizedRequestId);

  if (!request) {
    return emptyResult("Request could not be found.");
  }

  if (!isShareEligibleStatus(request.status)) {
    return emptyResult(
      "Photo sharing is available after availability is confirmed.",
    );
  }

  if (!request.property_codes.includes(normalizedPropertyId)) {
    return emptyResult("Selected property is not linked to this request.");
  }

  const validatedPhotoIds = await validateSelectedPhotos(
    supabase,
    normalizedPropertyId,
    uniquePhotoIds,
  );

  if (!validatedPhotoIds) {
    return emptyResult("One or more selected photos are invalid.");
  }

  const token = generateShareToken();
  const tokenHash = hashShareToken(token);
  const expiresAt = new Date(
    Date.now() + expirationHours * 60 * 60 * 1000,
  ).toISOString();

  const { data: shareRow, error: shareError } = await supabase
    .from("customer_photo_shares")
    .insert({
      share_token_hash: tokenHash,
      request_id: normalizedRequestId,
      property_id: normalizedPropertyId,
      expires_at: expiresAt,
      created_by: user.id,
    })
    .select("share_id")
    .single();

  if (shareError || !shareRow) {
    console.error("Failed to create customer photo share:", shareError?.message);
    return emptyResult("Share link could not be created. Please try again.");
  }

  const shareId = normalizeShareId(shareRow.share_id);

  const shareItems = validatedPhotoIds.map((photoId, index) => ({
    share_id: shareId,
    photo_id: photoId,
    display_order: index,
  }));

  const { error: itemsError } = await supabase
    .from("customer_photo_share_items")
    .insert(shareItems);

  if (itemsError) {
    console.error("Failed to create share items:", itemsError.message);
    await supabase
      .from("customer_photo_shares")
      .delete()
      .eq("share_id", shareId);

    return emptyResult("Share link could not be created. Please try again.");
  }

  revalidatePath(`/admin/requests/${normalizedRequestId}`);

  const shareUrl = await buildAbsoluteShareUrl(token);

  return {
    error: null,
    success: true,
    shareUrl,
  };
}

export async function revokeCustomerPhotoShareAction(
  requestId: unknown,
  shareId: unknown,
): Promise<RevokePhotoShareState> {
  const normalizedRequestId = parseAvailabilityRequestId(requestId);
  const normalizedShareId = normalizeShareId(shareId);

  if (!normalizedRequestId || !normalizedShareId) {
    return {
      error: "Invalid share.",
      success: false,
    };
  }

  await requireAdmin();
  const supabase = createAdminServiceClient();

  const { data: share, error: loadError } = await supabase
    .from("customer_photo_shares")
    .select("share_id, request_id, revoked_at")
    .eq("share_id", normalizedShareId)
    .eq("request_id", normalizedRequestId)
    .maybeSingle();

  if (loadError || !share) {
    return {
      error: "Share could not be found.",
      success: false,
    };
  }

  if (share.revoked_at) {
    return {
      error: null,
      success: true,
    };
  }

  const { error: updateError } = await supabase
    .from("customer_photo_shares")
    .update({ revoked_at: new Date().toISOString() })
    .eq("share_id", normalizedShareId);

  if (updateError) {
    console.error("Failed to revoke customer photo share:", updateError.message);
    return {
      error: "Share could not be revoked. Please try again.",
      success: false,
    };
  }

  revalidatePath(`/admin/requests/${normalizedRequestId}`);

  return {
    error: null,
    success: true,
  };
}
