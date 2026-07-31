import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { SectionHeading } from "./SectionHeading";
import { publicCardClass, publicContainerClass, publicSectionClass, publicStaggerItemClass } from "@/lib/public-ui";

const benefitKeys = [
  { title: "why.item1.title", desc: "why.item1.desc" },
  { title: "why.item2.title", desc: "why.item2.desc" },
  { title: "why.item3.title", desc: "why.item3.desc" },
  { title: "why.item4.title", desc: "why.item4.desc" },
] as const;

export async function WhyChooseUs() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <section id="why-us" className={`${publicSectionClass} bg-background`}>
      <div className={publicContainerClass}>
        <SectionHeading title={t("why.title")} description={t("why.subtitle")} />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {benefitKeys.map((benefit, index) => (
            <article
              key={benefit.title}
              className={`${publicCardClass} ${publicStaggerItemClass} p-7`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M9 10.5h.008v.008H9V10.5Zm.375 6a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z"
                  />
                </svg>
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {t(benefit.title)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(benefit.desc)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
