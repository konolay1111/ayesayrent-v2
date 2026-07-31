"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  PRIVATE_PHOTOS_BUCKET,
  buildPhotoStoragePath,
  createAdminStorageClient,
  logStorageOperationError,
  normalizeStoragePath,
} from "@/lib/supabase/admin-storage";
import { requireAdmin } from "@/lib/supabase/server";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type PropertyPhotoRow = {
  photo_id: string;
  property_id: string;
  storage_path: string;
  alt_text: string | null;
  display_order: number;
  is_cover: boolean;
  public_visible: boolean;
  created_at: string;
};

function revalidatePropertyPaths(propertyId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
}

function getFileExtension(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

function resolveMimeType(file: File) {
  const normalizedType = file.type.trim().toLowerCase();

  if (normalizedType === "image/jpg") {
    return "image/jpeg";
  }

  if (ALLOWED_MIME_TYPES.has(normalizedType)) {
    return normalizedType;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return null;
  }
}

function createUniqueFilename(mimeType: string) {
  return `${randomUUID()}.${getFileExtension(mimeType)}`;
}

async function loadPropertyPhoto(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  photoId: string,
  propertyId: string,
) {
  const { data, error } = await supabase
    .from("property_photos")
    .select("*")
    .eq("photo_id", photoId)
    .eq("property_id", propertyId)
    .single();

  if (error || !data) {
    console.error("Failed to load property photo:", error);
    throw new Error("Property photo could not be loaded.");
  }

  return data as PropertyPhotoRow;
}

async function ensureCoverPhoto(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  propertyId: string,
) {
  const { data: existingCover, error: coverError } = await supabase
    .from("property_photos")
    .select("photo_id")
    .eq("property_id", propertyId)
    .eq("is_cover", true)
    .maybeSingle();

  if (coverError) {
    console.error("Failed to check existing cover photo:", coverError);
    throw new Error("Cover photo could not be updated.");
  }

  if (existingCover) {
    return;
  }

  const { data: nextCover, error: nextCoverError } = await supabase
    .from("property_photos")
    .select("photo_id")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (nextCoverError) {
    console.error("Failed to load next cover photo:", nextCoverError);
    throw new Error("Cover photo could not be updated.");
  }

  if (!nextCover) {
    return;
  }

  const { error: updateError } = await supabase
    .from("property_photos")
    .update({ is_cover: true })
    .eq("photo_id", nextCover.photo_id)
    .eq("property_id", propertyId);

  if (updateError) {
    console.error("Failed to assign cover photo:", updateError);
    throw new Error("Cover photo could not be updated.");
  }
}

export async function uploadPropertyPhotosAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  const files = formData
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);

  if (files.length === 0) {
    throw new Error("At least one image file is required.");
  }

  const { supabase } = await requireAdmin();
  const storageClient = createAdminStorageClient();

  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("property_id")
    .eq("property_id", propertyId)
    .maybeSingle();

  if (propertyError || !property) {
    console.error("Failed to load property before photo upload:", propertyError);
    throw new Error("Property could not be loaded.");
  }

  const { count: existingPhotoCount, error: countError } = await supabase
    .from("property_photos")
    .select("*", { count: "exact", head: true })
    .eq("property_id", propertyId);

  if (countError) {
    console.error("Failed to count existing property photos:", countError);
    throw new Error("Property photos could not be loaded.");
  }

  const { data: highestOrderPhoto, error: orderError } = await supabase
    .from("property_photos")
    .select("display_order")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    console.error("Failed to load photo display order:", orderError);
    throw new Error("Property photos could not be loaded.");
  }

  let nextDisplayOrder =
    typeof highestOrderPhoto?.display_order === "number"
      ? highestOrderPhoto.display_order + 1
      : 0;

  let coverAssigned = (existingPhotoCount ?? 0) > 0;
  let uploadedCount = 0;

  for (const file of files) {
    const mimeType = resolveMimeType(file);

    if (!mimeType) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed.");
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error("Each image must be 10 MB or smaller.");
    }

    const filename = createUniqueFilename(mimeType);
    const storagePath = buildPhotoStoragePath(propertyId, filename);
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await storageClient.storage
      .from(PRIVATE_PHOTOS_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      logStorageOperationError("Failed to upload property photo:", uploadError, {
        bucket: PRIVATE_PHOTOS_BUCKET,
        storagePath,
        fileType: mimeType,
        fileSize: file.size,
        originalFileType: file.type,
        originalFileName: file.name,
      });
      throw new Error("Photo upload failed.");
    }

    const isCover = !coverAssigned;

    const { error: insertError } = await supabase.from("property_photos").insert({
      property_id: propertyId,
      storage_path: storagePath,
      alt_text: null,
      display_order: nextDisplayOrder,
      is_cover: isCover,
      public_visible: false,
    });

    if (insertError) {
      console.error("Failed to insert property photo row:", insertError);

      const { error: cleanupError } = await storageClient.storage
        .from(PRIVATE_PHOTOS_BUCKET)
        .remove([storagePath]);

      if (cleanupError) {
        logStorageOperationError(
          "Failed to clean up uploaded photo:",
          cleanupError,
          { bucket: PRIVATE_PHOTOS_BUCKET, storagePath },
        );
      }

      throw new Error("Photo upload failed.");
    }

    if (isCover) {
      coverAssigned = true;
    }

    nextDisplayOrder += 1;
    uploadedCount += 1;
  }

  if (uploadedCount === 0) {
    throw new Error("No photos were uploaded.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?photosUploaded=1`);
}

export async function deletePropertyPhotoAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();
  const photoId = String(formData.get("photo_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  if (!photoId) {
    throw new Error("Photo ID is required.");
  }

  const { supabase } = await requireAdmin();
  const storageClient = createAdminStorageClient();
  const photo = await loadPropertyPhoto(supabase, photoId, propertyId);
  const storagePath = normalizeStoragePath(photo.storage_path);
  const wasCover = photo.is_cover;

  const { error: storageError } = await storageClient.storage
    .from(PRIVATE_PHOTOS_BUCKET)
    .remove([storagePath]);

  if (storageError) {
    logStorageOperationError("Failed to delete property photo from storage:", storageError, {
      bucket: PRIVATE_PHOTOS_BUCKET,
      storagePath,
    });
    throw new Error("Photo deletion failed.");
  }

  const { error: deleteError } = await supabase
    .from("property_photos")
    .delete()
    .eq("photo_id", photoId)
    .eq("property_id", propertyId);

  if (deleteError) {
    console.error("Failed to delete property photo row:", deleteError);
    throw new Error("Photo deletion failed.");
  }

  if (wasCover) {
    await ensureCoverPhoto(supabase, propertyId);
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?photoDeleted=1`);
}

export async function setCoverPhotoAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();
  const photoId = String(formData.get("photo_id") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  if (!photoId) {
    throw new Error("Photo ID is required.");
  }

  const { supabase } = await requireAdmin();
  await loadPropertyPhoto(supabase, photoId, propertyId);

  const { error: clearCoverError } = await supabase
    .from("property_photos")
    .update({ is_cover: false })
    .eq("property_id", propertyId);

  if (clearCoverError) {
    console.error("Failed to clear cover photo flags:", clearCoverError);
    throw new Error("Cover photo update failed.");
  }

  const { error: setCoverError } = await supabase
    .from("property_photos")
    .update({ is_cover: true })
    .eq("photo_id", photoId)
    .eq("property_id", propertyId);

  if (setCoverError) {
    console.error("Failed to set cover photo:", setCoverError);
    throw new Error("Cover photo update failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?coverUpdated=1`);
}

export async function updatePhotoAltTextAction(formData: FormData) {
  const propertyId = String(formData.get("property_id") ?? "").trim();
  const photoId = String(formData.get("photo_id") ?? "").trim();
  const altText = String(formData.get("alt_text") ?? "").trim();

  if (!propertyId) {
    throw new Error("Property ID is required.");
  }

  if (!photoId) {
    throw new Error("Photo ID is required.");
  }

  const { supabase } = await requireAdmin();
  await loadPropertyPhoto(supabase, photoId, propertyId);

  const { error: updateError } = await supabase
    .from("property_photos")
    .update({ alt_text: altText === "" ? null : altText })
    .eq("photo_id", photoId)
    .eq("property_id", propertyId);

  if (updateError) {
    console.error("Failed to update photo alt text:", updateError);
    throw new Error("Photo alt text update failed.");
  }

  revalidatePropertyPaths(propertyId);

  redirect(`/admin/properties/${propertyId}?photoUpdated=1`);
}
