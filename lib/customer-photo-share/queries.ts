import { createSignedPrivatePhotoUrl } from "@/lib/supabase/admin-storage";
import { createAdminServiceClient } from "@/lib/supabase/admin-service";
import { PUBLIC_PROPERTY_COLUMNS } from "@/lib/public-search/fields";
import { formatPublicPropertyReference } from "@/lib/admin/requests";
import { CUSTOMER_SIGNED_URL_EXPIRY_SECONDS } from "@/lib/customer-photo-share/constants";
import { hashShareToken } from "@/lib/customer-photo-share/tokens";
import {
  parseAvailabilityRequestId,
} from "@/lib/admin/request-ids";
import type {
  CustomerPhotoShareItemRow,
  CustomerPhotoShareRow,
  PublicShareView,
  ShareListItem,
  SharePhotoRecord,
} from "@/lib/customer-photo-share/types";

type PropertyPhotoRow = {
  photo_id: string;
  property_id: string;
  storage_path: string;
  alt_text: string | null;
  display_order: number;
};

function resolveShareStatus(
  share: Pick<CustomerPhotoShareRow, "expires_at" | "revoked_at">,
): ShareListItem["status"] {
  if (share.revoked_at) {
    return "revoked";
  }

  if (new Date(share.expires_at).getTime() <= Date.now()) {
    return "expired";
  }

  return "active";
}

export async function getRequestPhotoShares(
  requestId: unknown,
): Promise<ShareListItem[]> {
  const normalizedRequestId = parseAvailabilityRequestId(requestId);

  if (!normalizedRequestId) {
    return [];
  }

  const supabase = createAdminServiceClient();

  const { data: shares, error } = await supabase
    .from("customer_photo_shares")
    .select("share_id, property_id, expires_at, revoked_at, created_at")
    .eq("request_id", normalizedRequestId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load customer photo shares:", error.message);
    return [];
  }

  const shareRows = (shares ?? []) as CustomerPhotoShareRow[];

  if (shareRows.length === 0) {
    return [];
  }

  const shareIds = shareRows.map((share) => share.share_id);

  const { data: itemCounts, error: itemError } = await supabase
    .from("customer_photo_share_items")
    .select("share_id")
    .in("share_id", shareIds);

  if (itemError) {
    console.error("Failed to load share item counts:", itemError.message);
  }

  const countByShareId = new Map<string, number>();

  for (const item of itemCounts ?? []) {
    const shareId = (item as Pick<CustomerPhotoShareItemRow, "share_id">)
      .share_id;
    countByShareId.set(shareId, (countByShareId.get(shareId) ?? 0) + 1);
  }

  return shareRows.map((share) => ({
    shareId: share.share_id,
    propertyId: share.property_id,
    expiresAt: share.expires_at,
    revokedAt: share.revoked_at,
    createdAt: share.created_at,
    photoCount: countByShareId.get(share.share_id) ?? 0,
    status: resolveShareStatus(share),
  }));
}

export async function getPropertyPhotosForShareSelection(
  propertyIds: string[],
): Promise<
  Array<{
    photoId: string;
    propertyId: string;
    altText: string | null;
    displayOrder: number;
    signedUrl: string | null;
  }>
> {
  const uniquePropertyIds = [...new Set(propertyIds.map((id) => id.trim()))].filter(
    Boolean,
  );

  if (uniquePropertyIds.length === 0) {
    return [];
  }

  const supabase = createAdminServiceClient();

  const { data, error } = await supabase
    .from("property_photos")
    .select("photo_id, property_id, storage_path, alt_text, display_order")
    .in("property_id", uniquePropertyIds)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load property photos for sharing:", error.message);
    return [];
  }

  const photos = (data ?? []) as PropertyPhotoRow[];

  const validPhotos = photos.filter(
    (photo) => photo.storage_path?.trim().length > 0,
  );

  const signedPhotos = await Promise.all(
    validPhotos.map(async (photo) => {
      try {
        const { data: signedData, error: signedError } =
          await createSignedPrivatePhotoUrl(photo.storage_path, 3600);

        return {
          photoId: photo.photo_id,
          propertyId: photo.property_id,
          altText: photo.alt_text,
          displayOrder: photo.display_order,
          signedUrl: signedError ? null : (signedData?.signedUrl ?? null),
        };
      } catch {
        return {
          photoId: photo.photo_id,
          propertyId: photo.property_id,
          altText: photo.alt_text,
          displayOrder: photo.display_order,
          signedUrl: null,
        };
      }
    }),
  );

  return signedPhotos;
}

export async function loadPublicShareByToken(
  token: string,
): Promise<PublicShareView | null> {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    return null;
  }

  const supabase = createAdminServiceClient();
  const tokenHash = hashShareToken(normalizedToken);

  const { data: share, error } = await supabase
    .from("customer_photo_shares")
    .select("*")
    .eq("share_token_hash", tokenHash)
    .maybeSingle();

  if (error || !share) {
    return null;
  }

  const shareRow = share as CustomerPhotoShareRow;

  if (shareRow.revoked_at) {
    return null;
  }

  if (new Date(shareRow.expires_at).getTime() <= Date.now()) {
    return null;
  }

  const { data: shareItems, error: itemsError } = await supabase
    .from("customer_photo_share_items")
    .select("photo_id, display_order")
    .eq("share_id", shareRow.share_id)
    .order("display_order", { ascending: true });

  if (itemsError || !shareItems?.length) {
    return null;
  }

  const photoIds = shareItems.map(
    (item) => (item as Pick<CustomerPhotoShareItemRow, "photo_id">).photo_id,
  );

  const { data: photoRows, error: photoError } = await supabase
    .from("property_photos")
    .select("photo_id, property_id, storage_path, alt_text, display_order")
    .in("photo_id", photoIds)
    .eq("property_id", shareRow.property_id);

  if (photoError || !photoRows?.length) {
    return null;
  }

  const photosById = new Map(
    (photoRows as PropertyPhotoRow[]).map((photo) => [photo.photo_id, photo]),
  );

  const orderedPhotos: SharePhotoRecord[] = shareItems
    .map((item) => {
      const photoId = (item as Pick<CustomerPhotoShareItemRow, "photo_id">)
        .photo_id;
      const photo = photosById.get(photoId);

      if (!photo?.storage_path?.trim()) {
        return null;
      }

      return {
        photoId: photo.photo_id,
        storagePath: photo.storage_path,
        altText: photo.alt_text,
        displayOrder: (
          item as Pick<CustomerPhotoShareItemRow, "display_order">
        ).display_order,
      };
    })
    .filter((photo): photo is SharePhotoRecord => photo !== null);

  if (orderedPhotos.length === 0) {
    return null;
  }

  const signedPhotos = await Promise.all(
    orderedPhotos.map(async (photo) => {
      const { data, error: signedError } = await createSignedPrivatePhotoUrl(
        photo.storagePath,
        CUSTOMER_SIGNED_URL_EXPIRY_SECONDS,
      );

      if (signedError || !data?.signedUrl) {
        return null;
      }

      return {
        altText: photo.altText,
        signedUrl: data.signedUrl,
      };
    }),
  );

  const validSignedPhotos = signedPhotos.filter(
    (photo): photo is { altText: string | null; signedUrl: string } =>
      photo !== null,
  );

  if (validSignedPhotos.length === 0) {
    return null;
  }

  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select(PUBLIC_PROPERTY_COLUMNS)
    .eq("property_id", shareRow.property_id)
    .maybeSingle();

  if (propertyError) {
    console.error("Failed to load share property summary:", propertyError.message);
  }

  const property = propertyData as {
    property_id: string;
    area: string | null;
    transit_name: string | null;
  } | null;

  return {
    listingReference: formatPublicPropertyReference(shareRow.property_id),
    area: property?.area ?? null,
    transitName: property?.transit_name ?? null,
    expiresAt: shareRow.expires_at,
    photos: validSignedPhotos,
  };
}
