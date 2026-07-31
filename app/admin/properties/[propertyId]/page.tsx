import Link from "next/link";
import { updateAmenityAction } from "@/app/admin/amenity-actions";
import { updatePropertyAction } from "@/app/admin/actions";
import { updateFeeAction } from "@/app/admin/fee-actions";
import { updateNearbyAction } from "@/app/admin/nearby-actions";
import {
  PropertyPhotosSection,
  type PropertyPhotoView,
} from "@/components/admin/PropertyPhotosSection";
import {
  AdminHeader,
  AdminPageHeading,
} from "@/components/admin/AdminHeader";
import { buildBlankRoomRateTemplate } from "@/lib/admin/room-rate-fields";
import { RoomRatesSection } from "@/components/admin/RoomRatesSection";
import {
  CollapsibleSection,
  PropertySection,
  SectionNav,
  SuccessBanner,
} from "@/components/admin/PropertySectionShell";
import {
  createSignedPrivatePhotoUrl,
  PRIVATE_PHOTOS_BUCKET,
} from "@/lib/supabase/admin-storage";
import { requireAdmin } from "@/lib/supabase/server";

const SIGNED_URL_EXPIRY_SECONDS = 3600;

type PropertyDetailsPageProps = {
  params: Promise<{
    propertyId: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    roomSaved?: string;
    roomCreated?: string;
    roomDeleted?: string;
    roomError?: string;
    amenitiesSaved?: string;
    feesSaved?: string;
    nearbySaved?: string;
    photosUploaded?: string;
    photoDeleted?: string;
    coverUpdated?: string;
    photoUpdated?: string;
  }>;
};

type DataRecord = Record<string, unknown>;

const protectedPropertyFields = new Set([
  "property_id",
  "id",
  "created_at",
  "updated_at",
]);

const amenityBooleanFields = [
  "motorcycle_parking_available",
  "pool_available",
  "gym_available",
  "balcony_available",
  "lift_available",
  "tm30_available",
  "pet_friendly",
] as const;

const amenityNumericFields = [
  "motorcycle_parking_fee_thb",
  "pool_fee_thb",
  "gym_fee_thb",
  "pet_fee_thb",
] as const;

const amenityTextFields = [
  "motorcycle_parking_raw",
  "pool_raw",
  "gym_raw",
  "balcony_raw",
  "lift_raw",
  "tm30_raw",
  "pet_policy_raw",
] as const;

const feeFields = [
  "water_fee_raw",
  "electricity_fee_raw",
  "cleaning_fee_raw",
  "key_card_fee_raw",
  "common_area_fee_raw",
  "deposit_return_period_raw",
  "data_quality_status",
] as const;

const nearbyTextFields = [
  "big_c_or_supermarket",
  "lotus_or_supermarket",
  "hospital",
  "market",
] as const;

const nearbyTextareaFields = [
  "shopping_mall_or_outdoor",
  "additional_nearby",
] as const;

const sectionNavLinks = [
  { href: "#property-section", label: "Property" },
  { href: "#room-rates-section", label: "Room Rates" },
  { href: "#amenities-section", label: "Amenities" },
  { href: "#fees-section", label: "Fees" },
  { href: "#nearby-section", label: "Nearby" },
  { href: "#photos-section", label: "Private Photos" },
] as const;

const propertyGroupOrder = [
  "basic",
  "location",
  "rental",
  "contact",
  "description",
  "system",
] as const;

type PropertyGroupKey = (typeof propertyGroupOrder)[number];

const propertyGroupLabels: Record<PropertyGroupKey, string> = {
  basic: "Basic Information",
  location: "Location and Transit",
  rental: "Rental and Contract",
  contact: "Contact and Management",
  description: "Description and Notes",
  system: "System Fields",
};

export default async function PropertyDetailsPage({
  params,
  searchParams,
}: PropertyDetailsPageProps) {
  const { propertyId } = await params;
  const {
    saved,
    roomSaved,
    roomCreated,
    roomDeleted,
    roomError,
    amenitiesSaved,
    feesSaved,
    nearbySaved,
    photosUploaded,
    photoDeleted,
    coverUpdated,
    photoUpdated,
  } = await searchParams;
  const { supabase } = await requireAdmin();

  const [
    propertyResult,
    roomRatesResult,
    amenitiesResult,
    feesResult,
    nearbyResult,
    photosResult,
  ] = await Promise.all([
    supabase
      .from("properties")
      .select("*")
      .eq("property_id", propertyId)
      .single(),

    supabase
      .from("room_rates")
      .select("*")
      .eq("property_id", propertyId)
      .order("room_rate_id"),

    supabase
      .from("amenities")
      .select("*")
      .eq("property_id", propertyId)
      .maybeSingle(),

    supabase
      .from("fees")
      .select("*")
      .eq("property_id", propertyId)
      .maybeSingle(),

    supabase
      .from("nearby")
      .select("*")
      .eq("property_id", propertyId)
      .maybeSingle(),

    supabase
      .from("property_photos")
      .select("*")
      .eq("property_id", propertyId)
      .order("is_cover", { ascending: false })
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  const property = propertyResult.data as DataRecord | null;
  const roomRates = (roomRatesResult.data ?? []) as DataRecord[];
  const amenities = amenitiesResult.data as DataRecord | null;
  const fees = feesResult.data as DataRecord | null;
  const nearby = nearbyResult.data as DataRecord | null;
  const propertyPhotos = (photosResult.data ?? []) as Omit<
    PropertyPhotoView,
    "signedUrl"
  >[];

  const photosWithSignedUrls = await Promise.all(
    propertyPhotos.map(async (photo) => {
      try {
        const { data, error } = await createSignedPrivatePhotoUrl(
          photo.storage_path,
          SIGNED_URL_EXPIRY_SECONDS,
        );

        if (error) {
          console.error("Failed to create signed URL for property photo:", {
            message: error.message,
            name: error.name,
            statusCode:
              "statusCode" in error
                ? (error as { statusCode?: string | number }).statusCode
                : null,
            storagePath: photo.storage_path,
            bucket: PRIVATE_PHOTOS_BUCKET,
          });
        }

        return {
          ...photo,
          signedUrl: data?.signedUrl ?? null,
        };
      } catch (error) {
        console.error("Failed to create signed URL for property photo:", {
          storagePath: photo.storage_path,
          bucket: PRIVATE_PHOTOS_BUCKET,
          error,
        });

        return {
          ...photo,
          signedUrl: null,
        };
      }
    }),
  );

  if (!property) {
    return (
      <div className="min-h-full bg-white font-sans text-zinc-800">
        <AdminHeader currentPath="/admin/properties" />

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-zinc-900">Property not found</h1>

          <Link
            href="/admin/properties"
            className="mt-4 inline-block text-sm font-semibold text-emerald-700"
          >
            ← Back to Properties
          </Link>
        </main>
      </div>
    );
  }

  const propertyIdValue = String(property.property_id);
  const groupedPropertyFields = groupPropertyFields(property);
  const blankRoomTemplate = buildBlankRoomRateTemplate(
    (roomRates[0] as DataRecord | undefined) ?? null,
  );

  return (
    <div className="min-h-full bg-white font-sans text-zinc-800">
      <AdminHeader currentPath="/admin/properties" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <AdminPageHeading
          titleMyanmar={`ပိုင်ဆိုင်မှု ${displayValue(property.property_id)}`}
          titleEnglish={`Property ${displayValue(property.property_id)}`}
          description={`${displayValue(property.area)} · ${displayValue(property.transit_name)}`}
        />

        <Link
          href="/admin/properties"
          className="inline-flex text-sm font-semibold text-emerald-700"
        >
          ← Back to Properties
        </Link>

        <SectionNav links={[...sectionNavLinks]} />

      <PropertySection
        id="property-section"
        title="Edit Property Details"
        description="Edit the information and press Save Changes."
        banner={saved === "1" ? <SuccessBanner message="Property saved successfully." /> : null}
      >
        <form action={updatePropertyAction} className="mt-6">
          <input type="hidden" name="property_id" value={propertyIdValue} />

          <div className="space-y-8">
            {propertyGroupOrder.map((groupKey) => {
              const fields = groupedPropertyFields[groupKey];

              if (fields.length === 0) {
                return null;
              }

              return (
                <div key={groupKey}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {propertyGroupLabels[groupKey]}
                  </h3>

                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {fields.map(([fieldName, value]) => (
                      <PropertyField
                        key={fieldName}
                        fieldName={fieldName}
                        value={value}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </PropertySection>

      <CollapsibleSection
        id="room-rates-section"
        title="Room Rates"
        description="Edit room details and press Save Room, or add a new room rate."
        countLabel={`${roomRates.length} room${roomRates.length === 1 ? "" : "s"}`}
        defaultOpen
        banner={
          roomSaved === "1" ||
          roomCreated === "1" ||
          roomDeleted === "1" ||
          roomError === "1" ? (
            <div className="mb-4 space-y-3">
              {roomSaved === "1" ? (
                <SuccessBanner message="Room rate saved successfully." />
              ) : null}
              {roomCreated === "1" ? (
                <SuccessBanner message="Room rate created successfully." />
              ) : null}
              {roomDeleted === "1" ? (
                <SuccessBanner message="Room rate deleted successfully." />
              ) : null}
              {roomError === "1" ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                  Room rate could not be created. Check required fields and try
                  again.
                </div>
              ) : null}
            </div>
          ) : null
        }
      >
        <RoomRatesSection
          propertyId={propertyIdValue}
          roomRates={roomRates}
          blankRoomTemplate={blankRoomTemplate}
        />
      </CollapsibleSection>

      <CollapsibleSection
        id="amenities-section"
        title="Amenities"
        description="Edit amenity availability, fees, and notes, then press Save Amenities."
        banner={
          amenitiesSaved === "1" ? (
            <div className="mb-4">
              <SuccessBanner message="Amenities saved successfully." />
            </div>
          ) : null
        }
      >
        <AmenitiesSection amenities={amenities} propertyId={propertyIdValue} />
      </CollapsibleSection>

      <CollapsibleSection
        id="fees-section"
        title="Fees"
        description="Edit fee details and press Save Fees."
        banner={
          feesSaved === "1" ? (
            <div className="mb-4">
              <SuccessBanner message="Fees saved successfully." />
            </div>
          ) : null
        }
      >
        <FeesSection fees={fees} propertyId={propertyIdValue} />
      </CollapsibleSection>

      <CollapsibleSection
        id="nearby-section"
        title="Nearby"
        description="Edit nearby places and press Save Nearby."
        banner={
          nearbySaved === "1" ? (
            <div className="mb-4">
              <SuccessBanner message="Nearby information saved successfully." />
            </div>
          ) : null
        }
      >
        <NearbySection nearby={nearby} propertyId={propertyIdValue} />
      </CollapsibleSection>

      <CollapsibleSection
        id="photos-section"
        title="Private Property Photos"
        description="Upload and manage private admin-only images."
        countLabel={`${photosWithSignedUrls.length} photo${photosWithSignedUrls.length === 1 ? "" : "s"}`}
        defaultOpen
        banner={
          photosUploaded === "1" ||
          photoDeleted === "1" ||
          coverUpdated === "1" ||
          photoUpdated === "1" ? (
            <div className="mb-4 space-y-3">
              {photosUploaded === "1" ? (
                <SuccessBanner message="Photos uploaded successfully." />
              ) : null}
              {photoDeleted === "1" ? (
                <SuccessBanner message="Photo deleted successfully." />
              ) : null}
              {coverUpdated === "1" ? (
                <SuccessBanner message="Cover photo updated successfully." />
              ) : null}
              {photoUpdated === "1" ? (
                <SuccessBanner message="Photo alt text saved successfully." />
              ) : null}
            </div>
          ) : null
        }
      >
        <PropertyPhotosSection
          photos={photosWithSignedUrls}
          propertyId={propertyIdValue}
        />
      </CollapsibleSection>
      </main>
    </div>
  );
}

function PropertyField({
  fieldName,
  value,
}: {
  fieldName: string;
  value: unknown;
}) {
  const isProtected = protectedPropertyFields.has(fieldName);
  const isBoolean = typeof value === "boolean";
  const isNumber = typeof value === "number";

  const isLongText =
    fieldName.includes("description") ||
    fieldName.includes("note") ||
    fieldName.includes("address");

  return (
    <div>
      <label
        htmlFor={fieldName}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {formatLabel(fieldName)}
      </label>

      {isBoolean ? (
        <select
          id={fieldName}
          name={fieldName}
          defaultValue={value ? "true" : "false"}
          disabled={isProtected}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      ) : isLongText ? (
        <textarea
          id={fieldName}
          name={fieldName}
          defaultValue={inputValue(value)}
          disabled={isProtected}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 disabled:bg-gray-100 disabled:text-gray-500"
        />
      ) : (
        <input
          id={fieldName}
          name={fieldName}
          type={isNumber ? "number" : "text"}
          step={isNumber ? "any" : undefined}
          defaultValue={inputValue(value)}
          disabled={isProtected}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600 disabled:bg-gray-100 disabled:text-gray-500"
        />
      )}

      {isProtected && (
        <p className="mt-1 text-xs text-gray-500">
          This system field cannot be changed.
        </p>
      )}
    </div>
  );
}

function AmenitiesSection({
  amenities,
  propertyId,
}: {
  amenities: DataRecord | null;
  propertyId: string;
}) {
  if (!amenities) {
    return <p className="text-gray-500">No amenities record found.</p>;
  }

  return (
    <form action={updateAmenityAction}>
      <input type="hidden" name="property_id" value={propertyId} />

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Availability
          </h3>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {amenityBooleanFields.map((fieldName) => (
              <AmenityBooleanField
                key={fieldName}
                fieldName={fieldName}
                value={amenities[fieldName]}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Fees (THB)
          </h3>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {amenityNumericFields.map((fieldName) => (
              <AmenityNumericField
                key={fieldName}
                fieldName={fieldName}
                value={amenities[fieldName]}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Notes
          </h3>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {amenityTextFields.map((fieldName) => (
              <AmenityTextField
                key={fieldName}
                fieldName={fieldName}
                value={amenities[fieldName]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Save Amenities
        </button>
      </div>
    </form>
  );
}

function AmenityBooleanField({
  fieldName,
  value,
}: {
  fieldName: string;
  value: unknown;
}) {
  const defaultValue =
    value === true || value === "true"
      ? "true"
      : value === false || value === "false"
        ? "false"
        : "false";

  return (
    <div>
      <label
        htmlFor={fieldName}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {formatLabel(fieldName)}
      </label>

      <select
        id={fieldName}
        name={fieldName}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
  );
}

function AmenityNumericField({
  fieldName,
  value,
}: {
  fieldName: string;
  value: unknown;
}) {
  return (
    <div>
      <label
        htmlFor={fieldName}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {formatLabel(fieldName)}
      </label>

      <input
        id={fieldName}
        name={fieldName}
        type="number"
        step="any"
        defaultValue={inputValue(value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

function AmenityTextField({
  fieldName,
  value,
}: {
  fieldName: string;
  value: unknown;
}) {
  return (
    <div>
      <label
        htmlFor={fieldName}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {formatLabel(fieldName)}
      </label>

      <input
        id={fieldName}
        name={fieldName}
        type="text"
        defaultValue={inputValue(value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

function FeesSection({
  fees,
  propertyId,
}: {
  fees: DataRecord | null;
  propertyId: string;
}) {
  if (!fees) {
    return <p className="text-gray-500">No fees record found.</p>;
  }

  return (
    <form action={updateFeeAction}>
      <input type="hidden" name="property_id" value={propertyId} />

      <div className="grid gap-5 md:grid-cols-2">
        {feeFields.map((fieldName) => (
          <AmenityTextField
            key={fieldName}
            fieldName={fieldName}
            value={fees[fieldName]}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Save Fees
        </button>
      </div>
    </form>
  );
}

function NearbySection({
  nearby,
  propertyId,
}: {
  nearby: DataRecord | null;
  propertyId: string;
}) {
  if (!nearby) {
    return <p className="text-gray-500">No nearby record found.</p>;
  }

  return (
    <form action={updateNearbyAction}>
      <input type="hidden" name="property_id" value={propertyId} />

      <div className="grid gap-5 md:grid-cols-2">
        {nearbyTextFields.map((fieldName) => (
          <AmenityTextField
            key={fieldName}
            fieldName={fieldName}
            value={nearby[fieldName]}
          />
        ))}

        {nearbyTextareaFields.map((fieldName) => (
          <NearbyTextareaField
            key={fieldName}
            fieldName={fieldName}
            value={nearby[fieldName]}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          Save Nearby
        </button>
      </div>
    </form>
  );
}

function NearbyTextareaField({
  fieldName,
  value,
}: {
  fieldName: string;
  value: unknown;
}) {
  return (
    <div className="md:col-span-2">
      <label
        htmlFor={fieldName}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {formatLabel(fieldName)}
      </label>

      <textarea
        id={fieldName}
        name={fieldName}
        rows={3}
        defaultValue={inputValue(value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
      />
    </div>
  );
}

function getPropertyFieldGroup(fieldName: string): PropertyGroupKey {
  if (
    fieldName === "property_id" ||
    fieldName === "id" ||
    fieldName === "created_at" ||
    fieldName === "updated_at"
  ) {
    return "system";
  }

  if (
    /transit|station|address|location|district|bts|mrt|travel|distance|latitude|longitude|map|walk|proximity|area/.test(
      fieldName,
    )
  ) {
    return "location";
  }

  if (
    /rent|deposit|contract|lease|monthly|minimum|advance|term|duration|fee|price/.test(
      fieldName,
    )
  ) {
    return "rental";
  }

  if (
    /contact|phone|line|owner|manager|agent|email|whatsapp|consultant/.test(
      fieldName,
    )
  ) {
    return "contact";
  }

  if (
    /description|note|remark|comment|policy|detail|instruction|summary/.test(
      fieldName,
    )
  ) {
    return "description";
  }

  return "basic";
}

function groupPropertyFields(property: DataRecord) {
  const groups: Record<PropertyGroupKey, Array<[string, unknown]>> = {
    basic: [],
    location: [],
    rental: [],
    contact: [],
    description: [],
    system: [],
  };

  for (const [fieldName, value] of Object.entries(property)) {
    groups[getPropertyFieldGroup(fieldName)].push([fieldName, value]);
  }

  return groups;
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function inputValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}