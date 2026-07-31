import {
  deletePropertyPhotoAction,
  setCoverPhotoAction,
  updatePhotoAltTextAction,
  uploadPropertyPhotosAction,
} from "@/app/admin/photo-actions";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";

export type PropertyPhotoView = {
  photo_id: string;
  property_id: string;
  storage_path: string;
  alt_text: string | null;
  display_order: number;
  is_cover: boolean;
  public_visible: boolean;
  created_at: string;
  signedUrl: string | null;
};

type PropertyPhotosSectionProps = {
  photos: PropertyPhotoView[];
  propertyId: string;
};

export function PropertyPhotosSection({
  photos,
  propertyId,
}: PropertyPhotosSectionProps) {
  return (
    <>
      <form
        action={uploadPropertyPhotosAction}
        className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5"
      >
        <input type="hidden" name="property_id" value={propertyId} />

        <label
          htmlFor="property-photos-upload"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Upload Photos
        </label>

        <input
          id="property-photos-upload"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800"
        />

        <p className="mt-2 text-xs text-gray-500">
          Private admin-only storage. Accepted formats: JPEG, PNG, WebP. Maximum
          10 MB per file. Photos are never shown on the public website.
        </p>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Upload Photos
          </button>
        </div>
      </form>

      {photos.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
          No private photos uploaded yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo) => (
            <article
              key={photo.photo_id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-gray-200">
                {photo.signedUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.signedUrl}
                    alt={photo.alt_text ?? "Private property photo"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
                    Preview unavailable
                  </div>
                )}

                {photo.is_cover ? (
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                    Cover
                  </span>
                ) : null}
              </div>

              <div className="space-y-3 p-4">
                <form action={updatePhotoAltTextAction}>
                  <input type="hidden" name="property_id" value={propertyId} />
                  <input type="hidden" name="photo_id" value={photo.photo_id} />

                  <label
                    htmlFor={`alt-text-${photo.photo_id}`}
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Alt Text
                  </label>

                  <input
                    id={`alt-text-${photo.photo_id}`}
                    name="alt_text"
                    type="text"
                    defaultValue={photo.alt_text ?? ""}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />

                  <button
                    type="submit"
                    className="mt-3 w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    Save Alt Text
                  </button>
                </form>

                <div className="grid gap-2">
                  {!photo.is_cover ? (
                    <form action={setCoverPhotoAction}>
                      <input
                        type="hidden"
                        name="property_id"
                        value={propertyId}
                      />
                      <input
                        type="hidden"
                        name="photo_id"
                        value={photo.photo_id}
                      />

                      <button
                        type="submit"
                        className="w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                      >
                        Set as Cover
                      </button>
                    </form>
                  ) : null}

                  <form action={deletePropertyPhotoAction}>
                    <input type="hidden" name="property_id" value={propertyId} />
                    <input type="hidden" name="photo_id" value={photo.photo_id} />

                    <ConfirmSubmitButton
                      message="Delete this photo? This action cannot be undone."
                      className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                    >
                      Delete Photo
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
