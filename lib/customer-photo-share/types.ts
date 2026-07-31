export type CustomerPhotoShareRow = {
  share_id: string;
  share_token_hash: string;
  request_id: string;
  property_id: string;
  expires_at: string;
  revoked_at: string | null;
  created_by: string | null;
  created_at: string;
};

export type CustomerPhotoShareItemRow = {
  share_item_id: string;
  share_id: string;
  photo_id: string;
  display_order: number;
  created_at: string;
};

export type SharePhotoRecord = {
  photoId: string;
  storagePath: string;
  altText: string | null;
  displayOrder: number;
};

export type ShareListItem = {
  shareId: string;
  propertyId: string;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  photoCount: number;
  status: "active" | "expired" | "revoked";
};

export type PublicShareView = {
  listingReference: string;
  area: string | null;
  transitName: string | null;
  expiresAt: string;
  photos: Array<{
    altText: string | null;
    signedUrl: string;
  }>;
};
