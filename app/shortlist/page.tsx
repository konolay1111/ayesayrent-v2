"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadShortlistSummariesAction } from "@/app/shortlist/actions";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ShortlistInquiryForm } from "@/components/shortlist/ShortlistInquiryForm";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { getButtonClassName } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import type { InquiryListingSummary } from "@/lib/public-inquiry/queries";
import { formatRentThb, formatRoomType, formatSizeSqm, formatFloor } from "@/lib/public-search/format";
import {
  SHORTLIST_CHANGE_EVENT,
  addToShortlist,
  parseShortlistSelection,
  readShortlist,
  removeFromShortlist,
} from "@/lib/shortlist";
import {
  publicBadgeClass,
  publicCardClass,
  publicContainerClass,
  publicDisclaimerClass,
  publicPageClass,
  typeH1Class,
  typeSmallClass,
} from "@/lib/public-ui";
import { cn } from "@/lib/cn";

export default function ShortlistPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const [codes, setCodes] = useState<string[]>([]);
  const [summaries, setSummaries] = useState<
    Map<string, InquiryListingSummary | null>
  >(new Map());
  const [summariesLoading, setSummariesLoading] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [removeCode, setRemoveCode] = useState<string | null>(null);
  const addedViaUrl = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const syncShortlist = useCallback(() => {
    setCodes(readShortlist());
  }, []);

  useEffect(() => {
    syncShortlist();

    const handleChange = () => syncShortlist();
    window.addEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [syncShortlist]);

  useEffect(() => {
    const addSelection = searchParams.get("add")?.trim();

    if (!addSelection || addedViaUrl.current) {
      return;
    }

    const parsedSelection = parseShortlistSelection(addSelection);

    if (parsedSelection) {
      addToShortlist(parsedSelection.propertyId, parsedSelection.roomRateId);
    }

    addedViaUrl.current = true;
    toast.success(t("toast.addedShortlist"));
    router.replace("/shortlist", { scroll: false });
  }, [searchParams, router, t, toast]);

  useEffect(() => {
    if (codes.length === 0) {
      setSummaries(new Map());
      setSummariesLoading(false);
      return;
    }

    let cancelled = false;
    setSummariesLoading(true);

    loadShortlistSummariesAction(codes)
      .then((results) => {
        if (cancelled) {
          return;
        }

        setSummaries(
          new Map(results.map((item) => [item.selectionKey, item.summary])),
        );
      })
      .finally(() => {
        if (!cancelled) {
          setSummariesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [codes]);

  const handleConfirmRemove = () => {
    if (removeCode) {
      removeFromShortlist(removeCode);
      toast.success(t("toast.removedShortlist"));
      setRemoveCode(null);
    }
  };

  const handleClearAll = () => {
    codes.forEach((code) => removeFromShortlist(code));
    setClearOpen(false);
    toast.success(t("toast.removedShortlist"));
  };

  return (
    <div className={publicPageClass}>
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-card px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className={publicContainerClass}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className={typeH1Class}>{t("shortlist.title")}</h1>
                <p className="mt-3 text-sm font-medium text-primary">{t("shortlist.subtitle")}</p>
              </div>
              {codes.length > 0 ? (
                <span className={cn(publicBadgeClass, "animate-badge-pop bg-primary text-primary-foreground ring-primary/20")}>
                  {codes.length} {t("shortlist.itemCount")}
                </span>
              ) : null}
            </div>
            <p className={`mt-5 max-w-2xl ${typeSmallClass}`}>{t("shortlist.body")}</p>
            <p className={`mt-5 max-w-2xl ${publicDisclaimerClass}`}>
              {t("availability.disclaimerShort")}
            </p>
          </div>
        </section>

        <div className={`${publicContainerClass} px-4 py-10 sm:px-6 lg:px-8`}>
          {codes.length === 0 ? (
            <section className={`${publicCardClass} px-6 py-16 sm:px-10 sm:py-20`}>
              <EmptyIllustration variant="shortlist" className="mb-8" />
              <h2 className="text-center text-lg font-semibold text-foreground sm:text-xl">
                {t("shortlist.empty")}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("shortlist.emptyHint")}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/search" className={getButtonClassName("primary", "md")}>
                  {t("search.submit")}
                </Link>
                <Link href="/#how-it-works" className={getButtonClassName("outline", "md")}>
                  {t("nav.howItWorks")}
                </Link>
              </div>
            </section>
          ) : (
            <div className="grid gap-8 lg:grid-cols-5">
              <section aria-labelledby="shortlist-items-heading" className="space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 id="shortlist-items-heading" className="text-lg font-semibold text-foreground">
                    {t("shortlist.selected")}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setClearOpen(true)}
                    className="min-h-10 rounded-lg px-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-destructive/25"
                  >
                    {t("shortlist.clearAll")}
                  </button>
                </div>

                <ul className="space-y-4">
                  {codes.map((selectionKey) => {
                    const summary = summaries.get(selectionKey);

                    return (
                      <li key={selectionKey} className="animate-fade-in-up">
                        <article className={`${publicCardClass} p-5`}>
                          <p className="font-mono text-sm font-semibold text-primary">
                            {summary?.publicReference ??
                              parseShortlistSelection(selectionKey)?.propertyId ??
                              selectionKey}
                          </p>
                          {summary?.roomRateId ? (
                            <p className="mt-1 font-mono text-xs text-muted-foreground">
                              {summary.roomRateId}
                            </p>
                          ) : null}

                          {summary ? (
                            <dl className="mt-4 space-y-2 text-sm">
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t("shortlist.monthlyRent")}</dt>
                                <dd className="font-medium text-foreground">
                                  {formatRentThb(summary.monthlyRent)}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t("card.roomType")}</dt>
                                <dd className="text-right font-medium text-foreground">
                                  {formatRoomType(summary.roomType)}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t("card.roomSize")}</dt>
                                <dd className="text-right font-medium text-foreground">
                                  {formatSizeSqm(summary.sizeSqm)}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">Floor</dt>
                                <dd className="text-right font-medium text-foreground">
                                  {formatFloor(summary.floorOptionsRaw)}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t("card.area")}</dt>
                                <dd className="text-right font-medium text-foreground">
                                  {summary.area ?? "—"}
                                </dd>
                              </div>
                              <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">{t("search.station")}</dt>
                                <dd className="text-right font-medium text-foreground">
                                  {summary.transitName ?? "—"}
                                </dd>
                              </div>
                            </dl>
                          ) : summariesLoading ? (
                            <div className="mt-4 space-y-2" aria-hidden="true">
                              <div className="h-4 animate-pulse rounded bg-muted" />
                              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                            </div>
                          ) : (
                            <p className="mt-3 text-sm text-muted-foreground">
                              {t("shortlist.detailsPending")}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() => setRemoveCode(selectionKey)}
                            className={getButtonClassName("destructive", "md", "mt-5 w-full")}
                          >
                            {t("shortlist.remove")}
                          </button>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section aria-labelledby="request-form-heading" className="lg:col-span-3">
                <div className={`${publicCardClass} p-6 sm:p-8`}>
                  <h2 id="request-form-heading" className="text-lg font-semibold text-foreground">
                    {t("shortlist.requestTitle")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t("shortlist.requestBody")}
                  </p>

                  <div className="mt-4 rounded-xl border border-primary/15 bg-secondary px-4 py-3">
                    <p className="text-sm font-medium text-secondary-foreground">
                      {t("shortlist.requestCodes")}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {codes.map((selectionKey) => (
                        <li
                          key={selectionKey}
                          className="rounded-lg bg-card px-2.5 py-1 font-mono text-xs font-semibold text-primary ring-1 ring-border"
                        >
                          {summaries.get(selectionKey)?.displayLabel ?? selectionKey}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ShortlistInquiryForm propertyCodes={codes} />
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title={t("modal.clearShortlist.title")}
        description={t("modal.clearShortlist.body")}
        confirmLabel={t("modal.confirm")}
        cancelLabel={t("modal.cancel")}
        onConfirm={handleClearAll}
        variant="destructive"
      />

      <Modal
        open={removeCode !== null}
        onClose={() => setRemoveCode(null)}
        title={t("modal.removeProperty.title")}
        description={t("modal.removeProperty.body")}
        confirmLabel={t("modal.confirm")}
        cancelLabel={t("modal.cancel")}
        onConfirm={handleConfirmRemove}
        variant="destructive"
      />
    </div>
  );
}
