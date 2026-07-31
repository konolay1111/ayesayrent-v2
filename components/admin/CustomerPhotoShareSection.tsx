"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createCustomerPhotoShareAction,
  revokeCustomerPhotoShareAction,
} from "@/app/admin/photo-share-actions";
import { CopyTextButton } from "@/components/admin/CopyTextButton";
import { formatPublicPropertyReference } from "@/lib/admin/requests";
import { SHARE_EXPIRATION_OPTIONS } from "@/lib/customer-photo-share/constants";
import type { ShareListItem } from "@/lib/customer-photo-share/types";

type SharePhotoOption = {
  photoId: string;
  propertyId: string;
  altText: string | null;
  displayOrder: number;
  signedUrl: string | null;
};

type CustomerPhotoShareSectionProps = {
  requestId: string | number;
  propertyIds: string[];
  photos: SharePhotoOption[];
  activeShares: ShareListItem[];
};

function formatShareDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shareStatusLabel(status: ShareListItem["status"]) {
  switch (status) {
    case "active":
      return "Active";
    case "expired":
      return "Expired";
    case "revoked":
      return "Revoked";
  }
}

export function CustomerPhotoShareSection({
  requestId,
  propertyIds,
  photos,
  activeShares,
}: CustomerPhotoShareSectionProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    propertyIds[0] ?? "",
  );
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [expirationKey, setExpirationKey] = useState<
    (typeof SHARE_EXPIRATION_OPTIONS)[number]["key"]
  >("24h");
  const [createdShareUrl, setCreatedShareUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const propertyPhotos = useMemo(
    () =>
      photos
        .filter((photo) => photo.propertyId === selectedPropertyId)
        .filter((photo) => photo.signedUrl),
    [photos, selectedPropertyId],
  );

  const togglePhoto = (photoId: string) => {
    setSelectedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId],
    );
  };

  const handleCreateShare = () => {
    startTransition(async () => {
      setFeedback(null);

      const result = await createCustomerPhotoShareAction(
        requestId,
        selectedPropertyId,
        selectedPhotoIds,
        expirationKey,
      );

      if (result.error) {
        setFeedback({ type: "error", message: result.error });
        return;
      }

      setCreatedShareUrl(result.shareUrl);
      setSelectedPhotoIds([]);
      setFeedback({
        type: "success",
        message: "Secure share link created. Copy it now — it cannot be shown again.",
      });
    });
  };

  const handleRevoke = (shareId: string) => {
    startTransition(async () => {
      setFeedback(null);

      const result = await revokeCustomerPhotoShareAction(requestId, shareId);

      if (result.error) {
        setFeedback({ type: "error", message: result.error });
        return;
      }

      setFeedback({
        type: "success",
        message: "Share link revoked.",
      });
    });
  };

  return (
    <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">
        Customer Photo Sharing
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        Select approved private photos and generate a temporary customer link.
        Only chosen photos are included. Links expire automatically and can be
        revoked at any time.
      </p>

      {propertyIds.length > 1 ? (
        <label className="mt-6 block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Property
          </span>
          <select
            value={selectedPropertyId}
            onChange={(event) => {
              setSelectedPropertyId(event.target.value);
              setSelectedPhotoIds([]);
            }}
            className="h-11 w-full max-w-md rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {propertyIds.map((propertyId) => (
              <option key={propertyId} value={propertyId}>
                {formatPublicPropertyReference(propertyId)}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-700">Select photos</p>

        {propertyPhotos.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500">
            No shareable photos found for this property. Upload private photos in
            the property editor first.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {propertyPhotos.map((photo) => {
              const selected = selectedPhotoIds.includes(photo.photoId);

              return (
                <label
                  key={photo.photoId}
                  className={`cursor-pointer overflow-hidden rounded-xl border transition-colors ${
                    selected
                      ? "border-emerald-400 ring-2 ring-emerald-200"
                      : "border-zinc-200 hover:border-emerald-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected}
                    onChange={() => togglePhoto(photo.photoId)}
                  />
                  <div className="aspect-[4/3] bg-zinc-100">
                    {photo.signedUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.signedUrl}
                        alt={photo.altText || "Property photo preview"}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="px-3 py-2 text-xs text-zinc-600">
                    {photo.altText?.trim() || "Private photo"}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Link expiration
          </span>
          <select
            value={expirationKey}
            onChange={(event) =>
              setExpirationKey(
                event.target.value as (typeof SHARE_EXPIRATION_OPTIONS)[number]["key"],
              )
            }
            className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {SHARE_EXPIRATION_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          disabled={
            isPending ||
            selectedPhotoIds.length === 0 ||
            propertyPhotos.length === 0
          }
          onClick={handleCreateShare}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating..." : "Generate Share Link"}
        </button>
      </div>

      {createdShareUrl ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">New share link</p>
          <p className="mt-2 break-all font-mono text-sm text-emerald-800">
            {createdShareUrl}
          </p>
          <div className="mt-3">
            <CopyTextButton
              value={createdShareUrl}
              label="Copy Share Link"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-300 bg-white px-4 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
            />
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div
          role="status"
          className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="mt-8 border-t border-zinc-100 pt-6">
        <h3 className="text-base font-semibold text-zinc-900">Active shares</h3>
        <p className="mt-1 text-xs text-zinc-500">
          Share URLs are shown only once at creation for security. Revoke and
          create a new link if the customer needs another copy.
        </p>

        {activeShares.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No shares created yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {activeShares.map((share) => (
              <article
                key={share.shareId}
                className="rounded-xl border border-zinc-100 bg-zinc-50 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-emerald-700">
                      {formatPublicPropertyReference(share.propertyId)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {share.photoCount} photo{share.photoCount === 1 ? "" : "s"}{" "}
                      · Created {formatShareDate(share.createdAt)}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      Expires {formatShareDate(share.expiresAt)}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      share.status === "active"
                        ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                        : share.status === "expired"
                          ? "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200"
                          : "bg-red-50 text-red-800 ring-1 ring-red-100"
                    }`}
                  >
                    {shareStatusLabel(share.status)}
                  </span>
                </div>

                {share.status === "active" ? (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRevoke(share.shareId)}
                    className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Revoke Link
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
