-- Public read access for search filters and listing search.
-- Allows anonymous SELECT on listable properties and related public columns only.
-- Admin-only tables remain blocked by default-deny RLS.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'properties'
      AND policyname = 'public_search_read_properties'
  ) THEN
    CREATE POLICY public_search_read_properties
      ON public.properties
      FOR SELECT
      TO anon, authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.room_rates rr
          WHERE rr.property_id = properties.property_id
            AND rr.monthly_rent_thb IS NOT NULL
            AND rr.monthly_rent_thb > 0
            AND (
              rr.record_status IS NULL
              OR lower(trim(rr.record_status)) NOT IN (
                'inactive',
                'archived',
                'deleted',
                'draft'
              )
            )
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'room_rates'
      AND policyname = 'public_search_read_room_rates'
  ) THEN
    CREATE POLICY public_search_read_room_rates
      ON public.room_rates
      FOR SELECT
      TO anon, authenticated
      USING (
        monthly_rent_thb IS NOT NULL
        AND monthly_rent_thb > 0
        AND (
          record_status IS NULL
          OR lower(trim(record_status)) NOT IN (
            'inactive',
            'archived',
            'deleted',
            'draft'
          )
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'amenities'
      AND policyname = 'public_search_read_amenities'
  ) THEN
    CREATE POLICY public_search_read_amenities
      ON public.amenities
      FOR SELECT
      TO anon, authenticated
      USING (
        EXISTS (
          SELECT 1
          FROM public.room_rates rr
          WHERE rr.property_id = amenities.property_id
            AND rr.monthly_rent_thb IS NOT NULL
            AND rr.monthly_rent_thb > 0
            AND (
              rr.record_status IS NULL
              OR lower(trim(rr.record_status)) NOT IN (
                'inactive',
                'archived',
                'deleted',
                'draft'
              )
            )
        )
      );
  END IF;
END $$;
