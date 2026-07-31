import Image from "next/image";
import Link from "next/link";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { getButtonClassName } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  publicContainerClass,
  publicFadeInClass,
} from "@/lib/public-ui";

const heroSecondaryButtonClass =
  "inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-primary bg-black/25 px-8 text-base font-semibold leading-snug text-white backdrop-blur-sm transition-all duration-200 hover:border-primary hover:bg-black/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40 active:scale-[0.98] sm:w-auto sm:min-w-52";

export async function HeroSection() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <section
      id="home"
      className="relative isolate min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[720px] lg:max-h-[760px]"
    >
      <Image
        src="/hero-bangkok.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/70"
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/80 to-transparent sm:h-32"
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative z-10 flex min-h-[520px] items-center sm:min-h-[600px] lg:min-h-[720px] lg:max-h-[760px]",
          publicFadeInClass,
        )}
      >
        <div
          className={`${publicContainerClass} w-full px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24`}
        >
          <p className="mx-auto mb-4 max-w-2xl text-xs font-semibold uppercase tracking-wider text-emerald-300">
            {t("hero.badge")}
          </p>

          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-[1.3] tracking-tight text-white sm:text-4xl sm:leading-[1.28] lg:text-5xl lg:leading-[1.22]">
            {t("hero.title")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg sm:leading-8">
            {t("hero.body")}
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className={getButtonClassName("primary", "lg", "w-full sm:w-auto sm:min-w-52")}
            >
              {t("hero.ctaSearch")}
            </Link>
            <Link href="/#how-it-works" className={heroSecondaryButtonClass}>
              {t("hero.ctaHowItWorks")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
