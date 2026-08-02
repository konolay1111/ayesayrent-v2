import Link from "next/link";
import { ClearShortlistOnSuccess } from "@/components/shortlist/ClearShortlistOnSuccess";
import { ContactBranding } from "@/components/branding/ContactBranding";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SuccessToastOnMount } from "@/components/shortlist/SuccessToastOnMount";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { formatPublicReference } from "@/lib/public-search/format";
import { parseShortlistSelection } from "@/lib/shortlist";
import { getButtonClassName } from "@/components/ui/Button";
import {
  publicCardClass,
  publicContainerClass,
  publicPageClass,
  typeH1Class,
  typeSmallClass,
} from "@/lib/public-ui";

type ShortlistSuccessPageProps = {
  searchParams: Promise<{
    ref?: string;
    propertyIds?: string;
  }>;
};

export default async function ShortlistSuccessPage({
  searchParams,
}: ShortlistSuccessPageProps) {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  const { ref = "", propertyIds = "" } = await searchParams;
  const requestReference = ref.trim();
  const submittedPropertyIds = propertyIds
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <div className={publicPageClass}>
      <Header />
      <SuccessToastOnMount message={t("toast.requestSubmitted")} />

      <main className="flex-1">
        <div className={`${publicContainerClass} px-4 py-12 sm:px-6 lg:px-8`}>
          <ClearShortlistOnSuccess />

          <section
            aria-live="polite"
            className={`${publicCardClass} overflow-hidden`}
          >
            <div className="border-b border-primary/15 bg-secondary px-6 py-10 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
                ✓
              </div>
              <h1 className={`mt-6 ${typeH1Class}`}>{t("contact.requestReceived")}</h1>
              <p className={`mx-auto mt-4 max-w-xl ${typeSmallClass} sm:text-base`}>
                {t("success.checkingOwners")}
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-primary">
                {t("success.responseTime")}
              </p>
            </div>

            <div className="space-y-6 px-6 py-8 sm:px-10">
              <p className={typeSmallClass}>{t("success.body")}</p>

              {requestReference && requestReference !== "received" ? (
                <div className="rounded-xl border border-border bg-muted px-4 py-4">
                  <p className="text-sm text-muted-foreground">{t("success.reference")}</p>
                  <p className="mt-1 font-mono text-xl font-bold text-primary">
                    {requestReference}
                  </p>
                </div>
              ) : null}

              {submittedPropertyIds.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-foreground">{t("success.selected")}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {submittedPropertyIds.map((id) => {
                      const parsedSelection = parseShortlistSelection(id);

                      return (
                        <li
                          key={id}
                          className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm font-semibold text-primary ring-1 ring-primary/15"
                        >
                          {parsedSelection
                            ? `${formatPublicReference(parsedSelection.propertyId)} • ${parsedSelection.roomRateId}`
                            : formatPublicReference(id)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t("success.step1")}</li>
                <li>{t("success.step2")}</li>
                <li>{t("success.step3")}</li>
              </ul>

              <div className="border-t border-border pt-8">
                <ContactBranding
                  contactHeading={t("contact.needAssistance")}
                  facebookLabel={t("contact.facebookPage")}
                  lineLabel={t("contact.lineId")}
                  lineQrLabel={t("contact.scanQr")}
                  lineQrAlt={t("contact.scanQrAlt")}
                  facebookMissingHint={t("branding.missingFacebook")}
                  lineMissingHint={t("branding.missingLineId")}
                  showQr={false}
                />
              </div>

              <Link
                href="/search"
                className={getButtonClassName("primary", "lg", "mt-4 w-full sm:mx-auto sm:w-auto sm:min-w-56")}
              >
                {t("success.backSearch")}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
