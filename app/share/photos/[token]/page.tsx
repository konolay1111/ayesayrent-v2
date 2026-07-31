import Link from "next/link";
import { ContactBranding } from "@/components/branding/ContactBranding";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PhotoShareGallery } from "@/components/share/PhotoShareGallery";
import { loadPublicShareByToken } from "@/lib/customer-photo-share/queries";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import {
  publicBtnSecondaryClass,
  publicCardClass,
  publicContainerClass,
  publicDisclaimerClass,
  publicPageClass,
} from "@/lib/public-ui";

type CustomerPhotoSharePageProps = {
  params: Promise<{
    token: string;
  }>;
};

function formatExpiryNotice(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function CustomerPhotoSharePage({
  params,
}: CustomerPhotoSharePageProps) {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  const { token } = await params;
  const share = await loadPublicShareByToken(decodeURIComponent(token));

  if (!share) {
    return (
      <div className={publicPageClass}>
        <Header />

        <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
          <div className={`max-w-lg ${publicCardClass} p-8 text-center`}>
            <h1 className="text-2xl font-bold text-foreground">{t("share.unavailable")}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("share.unavailableBody")}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ContactBranding
                contactHeading={t("contact.contactAgency")}
                facebookLabel={t("contact.facebookPage")}
                lineLabel={t("contact.lineId")}
                lineQrLabel={t("contact.scanQr")}
                lineQrAlt={t("contact.scanQrAlt")}
                facebookMissingHint={t("branding.missingFacebook")}
                lineMissingHint={t("branding.missingLineId")}
                showQr={false}
                layout="stack"
              />
              <Link href="/search" className={publicBtnSecondaryClass}>
                {t("share.backSearch")}
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className={publicPageClass}>
      <Header />

      <main className="flex-1">
        <div className={`${publicContainerClass} max-w-5xl px-4 py-10 sm:px-6 lg:px-8`}>
          <section className="rounded-2xl border border-primary/20 bg-secondary p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary-foreground">
              {t("share.preview")}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              {share.listingReference}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {share.area || t("card.notListed")} ·{" "}
              {share.transitName || t("card.notListed")}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-secondary-foreground">
              {t("share.expires")} {formatExpiryNotice(share.expiresAt)}.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">{t("share.photos")}</h2>
            <div className="mt-4">
              <PhotoShareGallery photos={share.photos} />
            </div>
          </section>

          <section className={`mt-8 ${publicDisclaimerClass}`}>
            <h2 className="text-base font-semibold">{t("share.notice")}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t("share.noticeBody")}</p>
          </section>

          <section className="mt-8 rounded-2xl border border-border bg-card p-6">
            <ContactBranding
              contactHeading={t("contact.contactAgency")}
              facebookLabel={t("contact.facebookPage")}
              lineLabel={t("contact.lineId")}
              lineQrLabel={t("contact.scanQr")}
              lineQrAlt={t("contact.scanQrAlt")}
              facebookMissingHint={t("branding.missingFacebook")}
              lineMissingHint={t("branding.missingLineId")}
              showQr={false}
            />
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/search" className={publicBtnSecondaryClass}>
              {t("share.backSearch")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
