import { createClient } from "@supabase/supabase-js";

export const PRIVATE_PHOTOS_BUCKET = "property-images-private";

export function createAdminStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase service role environment variables for private storage.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function createSignedPrivatePhotoUrl(
  storagePath: string,
  expiresInSeconds: number,
) {
  const storageClient = createAdminStorageClient();
  const normalizedPath = normalizeStoragePath(storagePath);

  return storageClient.storage
    .from(PRIVATE_PHOTOS_BUCKET)
    .createSignedUrl(normalizedPath, expiresInSeconds);
}

export function normalizeStoragePath(storagePath: string) {
  return storagePath.trim().replace(/^\/+/, "");
}

export function sanitizePropertyIdSegment(propertyId: string) {
  return propertyId.trim().replace(/[^a-zA-Z0-9_-]/g, "");
}

export function buildPhotoStoragePath(propertyId: string, filename: string) {
  const safePropertyId = sanitizePropertyIdSegment(propertyId);

  if (!safePropertyId) {
    throw new Error("Property ID is invalid.");
  }

  return normalizeStoragePath(`${safePropertyId}/${filename}`);
}

type StorageErrorDetails = {
  message?: string;
  name?: string;
  statusCode?: string | number;
  error?: string;
  [key: string]: unknown;
};

export function logStorageOperationError(
  context: string,
  error: unknown,
  metadata: Record<string, unknown>,
) {
  const storageError =
    typeof error === "object" && error !== null
      ? (error as StorageErrorDetails)
      : {};

  console.error(context, {
    message: storageError.message ?? null,
    statusCode: storageError.statusCode ?? storageError.error ?? null,
    name: storageError.name ?? null,
    ...metadata,
    rawError: error,
  });
}
