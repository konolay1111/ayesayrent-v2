import Link from "next/link";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { publicBtnPrimaryClass, publicBtnSecondaryClass, publicContainerClass, publicSectionClass } from "@/lib/public-ui";

export async function CtaSection() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <section className={`${publicSectionClass} bg-primary text-primary-foreground`}>
      <div className={`${publicContainerClass} text-center`}>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("cta.title")}</h2>
        <p className="mt-2 text-sm opacity-90">{t("cta.subtitle")}</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed opacity-90">
          {t("cta.body")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/search"
            className={`${publicBtnPrimaryClass} w-full border border-primary-foreground/20 bg-card text-primary sm:w-auto`}
          >
            {t("cta.search")}
          </Link>
          <Link
            href="/shortlist"
            className={`${publicBtnSecondaryClass} w-full border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15 sm:w-auto`}
          >
            {t("cta.shortlist")}
          </Link>
        </div>
      </div>
    </section>
  );
}
