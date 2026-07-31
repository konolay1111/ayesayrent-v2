"use client";

import Link from "next/link";
import { CompanyLogo } from "@/components/branding/CompanyLogo";
import { FacebookLink } from "@/components/branding/FacebookLink";
import { LineLink } from "@/components/branding/LineLink";
import { IconMenu } from "@/components/icons";
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher";
import { MobileShortlistBar } from "@/components/public/MobileShortlistBar";
import { ThemeToggle } from "@/components/public/ThemeToggle";
import { ShortlistNavLink } from "@/components/ShortlistNavLink";
import { getButtonClassName } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import {
  publicContainerClass,
  publicHeaderClass,
  publicNavLinkClass,
} from "@/lib/public-ui";

export function Header() {
  const { t } = useTranslation();

  return (
    <>
      <header className={publicHeaderClass}>
        <div
          className={`${publicContainerClass} flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8`}
        >
          <CompanyLogo className="shrink-0" />

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label={t("nav.main")}
          >
            <Link href="/search" className={publicNavLinkClass}>
              {t("nav.search")}
            </Link>
            <Link href="/#how-it-works" className={publicNavLinkClass}>
              {t("nav.howItWorks")}
            </Link>
            <ShortlistNavLink />
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/search" className={getButtonClassName("primary", "sm")}>
              {t("nav.searchShort")}
            </Link>
          </div>

          <details className="group relative lg:hidden">
            <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/25 [&::-webkit-details-marker]:hidden">
              <IconMenu size={22} className="text-foreground" />
              <span className="sr-only">{t("nav.openMenu")}</span>
            </summary>
            <nav
              className="absolute right-0 mt-2 w-72 animate-fade-in rounded-2xl border border-border bg-card py-2 shadow-xl"
              aria-label={t("nav.main")}
            >
              <Link
                href="/search"
                className="block px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                {t("nav.search")}
              </Link>
              <Link
                href="/#how-it-works"
                className="block px-4 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                {t("nav.howItWorks")}
              </Link>
              <div className="px-4 py-3.5">
                <ShortlistNavLink />
              </div>
              <div className="space-y-3 border-t border-border px-4 py-3.5">
                <FacebookLink
                  label={t("contact.facebookPage")}
                  missingHint={t("branding.missingFacebook")}
                  className="px-1 py-1"
                />
                <LineLink
                  label={t("contact.lineId")}
                  missingHint={t("branding.missingLineId")}
                  className="px-1 py-1"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3.5">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <div className="border-t border-border px-4 pt-3 pb-3">
                <Link href="/search" className={getButtonClassName("primary", "md", "w-full")}>
                  {t("nav.searchShort")}
                </Link>
              </div>
            </nav>
          </details>
        </div>
      </header>
      <MobileShortlistBar />
    </>
  );
}
