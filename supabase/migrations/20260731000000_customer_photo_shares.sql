-- Temporary customer photo shares for confirmed inquiries.
-- Public access is server-side only via service role after token validation.
-- RLS is enabled with no public policies.

CREATE TABLE IF NOT EXISTS customer_photo_shares (
  share_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_token_hash TEXT NOT NULL UNIQUE,
  request_id BIGINT NOT NULL REFERENCES availability_requests (id) ON DELETE CASCADE,
  property_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_photo_share_items (
  share_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID NOT NULL REFERENCES customer_photo_shares (share_id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES property_photos (photo_id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (share_id, photo_id)
);

CREATE INDEX IF NOT EXISTS customer_photo_shares_request_id_idx
  ON customer_photo_shares (request_id);

CREATE INDEX IF NOT EXISTS customer_photo_shares_property_id_idx
  ON customer_photo_shares (property_id);

CREATE INDEX IF NOT EXISTS customer_photo_shares_expires_at_idx
  ON customer_photo_shares (expires_at);

CREATE INDEX IF NOT EXISTS customer_photo_share_items_share_id_idx
  ON customer_photo_share_items (share_id);

CREATE INDEX IF NOT EXISTS customer_photo_share_items_photo_id_idx
  ON customer_photo_share_items (photo_id);

ALTER TABLE customer_photo_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_photo_share_items ENABLE ROW LEVEL SECURITY;
