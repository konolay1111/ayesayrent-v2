"use client";

import { useState } from "react";

type SharePhoto = {
  altText: string | null;
  signedUrl: string;
};

type PhotoShareGalleryProps = {
  photos: SharePhoto[];
};

export function PhotoShareGallery({ photos }: PhotoShareGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={`${photo.signedUrl}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 text-left transition-transform hover:-translate-y-0.5 hover:border-emerald-200"
          >
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.signedUrl}
                alt={photo.altText || `Property photo ${index + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute -top-12 right-0 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Close
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[activeIndex].signedUrl}
              alt={
                photos[activeIndex].altText ||
                `Property photo ${activeIndex + 1}`
              }
              className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain"
            />

            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((current) => (current ?? 0) - 1)}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <p className="text-sm text-white/80">
                {activeIndex + 1} / {photos.length}
              </p>
              <button
                type="button"
                disabled={activeIndex === photos.length - 1}
                onClick={() => setActiveIndex((current) => (current ?? 0) + 1)}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
