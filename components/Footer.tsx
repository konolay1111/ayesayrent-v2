"use client";

import Link from "next/link";
import { CompanyLogo } from "@/components/branding/CompanyLogo";
import { FacebookLink } from "@/components/branding/FacebookLink";
import { LineLink } from "@/components/branding/LineLink";
import { LineQrCode } from "@/components/branding/LineQrCode";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { publicContainerClass } from "@/lib/public-ui";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card px-4 py-10 sm:px-6 lg:px-8">
      <div className={`${publicContainerClass} flex flex-col items-center gap-8 text-center`}>
        <CompanyLogo />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <FacebookLink
            label={t("contact.facebookPage")}
            missingHint={t("branding.missingFacebook")}
          />
          <LineLink
            label={t("contact.lineId")}
            missingHint={t("branding.missingLineId")}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("contact.scanQr")}
          </p>
          <LineQrCode
            alt={t("contact.scanQrAlt")}
            missingHint={t("branding.missingQr")}
          />
        </div>

        <Link
          href="/admin/login"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {t("footer.adminLogin")}
        </Link>
      </div>
    </footer>
  );
}
