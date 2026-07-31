"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { getButtonClassName } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import {
  publicCardClass,
  publicContainerClass,
  publicPageClass,
  typeH1Class,
  typeSmallClass,
} from "@/lib/public-ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const isNetwork =
    error.message.toLowerCase().includes("fetch") ||
    error.message.toLowerCase().includes("network");

  return (
    <div className={publicPageClass}>
      <Header />
      <main className="flex flex-1 items-center px-4 py-16 sm:px-6">
        <div className={`${publicContainerClass} w-full`}>
          <section className={`${publicCardClass} mx-auto max-w-lg px-6 py-16 text-center sm:px-10`}>
            <EmptyIllustration variant="error" className="mb-8" />
            <h1 className={typeH1Class}>
              {isNetwork ? t("error.network.title") : t("error.server.title")}
            </h1>
            <p className={`mt-4 ${typeSmallClass}`}>
              {isNetwork ? t("error.network.body") : t("error.server.body")}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={reset}
                className={getButtonClassName("primary", "md")}
              >
                {t("error.retry")}
              </button>
              <Link href="/" className={getButtonClassName("secondary", "md")}>
                {t("brand.name")}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
