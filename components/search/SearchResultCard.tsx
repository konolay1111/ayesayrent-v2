"use client";

import Link from "next/link";
import { memo } from "react";
import { ShortlistButton } from "@/components/ShortlistButton";
import { VerifiedListingPlaceholder } from "@/components/search/VerifiedListingPlaceholder";
import { IconMapPin, IconPet } from "@/components/icons";
import {
  buildPropertyDetailHref,
  formatFloor,
  formatRentThb,
  formatRoomType,
  formatSizeSqm,
} from "@/lib/public-search/format";
import type { PublicListingResult } from "@/lib/public-search/types";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/cn";
import {
  publicBadgeClass,
  publicCardInteractiveClass,
  publicStaggerItemClass,
  typeSmallClass,
} from "@/lib/public-ui";

type SearchResultCardProps = {
  listing: PublicListingResult;
  index?: number;
};

function petLabel(
  value: boolean | null,
  t: (key: "card.petFriendly" | "card.petNotFriendly" | "card.petUnknown") => string,
) {
  if (value === true) return t("card.petFriendly");
  if (value === false) return t("card.petNotFriendly");
  return t("card.petUnknown");
}

export const SearchResultCard = memo(function SearchResultCard({
  listing,
  index = 0,
}: SearchResultCardProps) {
  const { t } = useTranslation();
  const petText = petLabel(listing.petFriendly, t);
  const isPetFriendly = listing.petFriendly === true;
  const detailHref = buildPropertyDetailHref(
    listing.propertyId,
    listing.roomRateId,
  );

  return (
    <article
      className={cn(
        publicCardInteractiveClass,
        publicStaggerItemClass,
        "group flex h-full flex-col overflow-hidden rounded-2xl",
      )}
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
    >
      <VerifiedListingPlaceholder
        publicReference={listing.publicReference}
        transitName={listing.transitName}
      />

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {formatRentThb(listing.monthlyRent)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("card.perMonth")}</p>
            </div>
            <span
              className={cn(
                publicBadgeClass,
                isPetFriendly
                  ? "bg-secondary text-secondary-foreground ring-primary/20"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <IconPet size={14} className="mr-1 inline-block align-text-bottom" />
              {petText}
            </span>
          </div>

          {listing.area ? (
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <IconMapPin size={16} className="shrink-0 text-primary/70" />
              {listing.area}
            </p>
          ) : null}
        </div>

        <dl className="grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className={typeSmallClass}>{t("card.roomType")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {formatRoomType(listing.roomType)}
            </dd>
          </div>
          <div>
            <dt className={typeSmallClass}>{t("card.roomSize")}</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {formatSizeSqm(listing.sizeSqm)}
            </dd>
          </div>
          <div>
            <dt className={typeSmallClass}>Floor</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {formatFloor(listing.floorOptionsRaw)}
            </dd>
          </div>
          {listing.amenities.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className={typeSmallClass}>{t("card.amenities")}</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className={cn(publicBadgeClass, "bg-muted text-foreground")}
                  >
                    {amenity}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-auto space-y-3 pt-2">
          <ShortlistButton
            propertyId={listing.propertyId}
            roomRateId={listing.roomRateId}
          />
          <Link
            href={detailHref}
            className="block text-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t("card.viewDetails")}
          </Link>
        </div>
      </div>
    </article>
  );
});
