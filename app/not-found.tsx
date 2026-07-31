import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { EmptyIllustration } from "@/components/ui/EmptyIllustration";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { getButtonClassName } from "@/components/ui/Button";
import {
  publicCardClass,
  publicContainerClass,
  publicPageClass,
  typeH1Class,
  typeSmallClass,
} from "@/lib/public-ui";

export default async function NotFound() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <div className={publicPageClass}>
      <Header />
      <main className="flex flex-1 items-center px-4 py-16 sm:px-6">
        <div className={`${publicContainerClass} w-full`}>
          <section className={`${publicCardClass} mx-auto max-w-lg px-6 py-16 text-center sm:px-10`}>
            <EmptyIllustration variant="error" className="mb-8" />
            <h1 className={typeH1Class}>{t("error.notFound.title")}</h1>
            <p className={`mt-4 ${typeSmallClass}`}>{t("error.notFound.body")}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className={getButtonClassName("primary", "md")}>
                {t("brand.name")}
              </Link>
              <Link href="/search" className={getButtonClassName("outline", "md")}>
                {t("search.submit")}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
