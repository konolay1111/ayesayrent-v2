import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { SectionHeading } from "./SectionHeading";
import { publicCardClass, publicContainerClass, publicSectionClass, publicStaggerItemClass } from "@/lib/public-ui";

const stepKeys = [
  { step: "1", title: "how.step1.title", desc: "how.step1.desc" },
  { step: "2", title: "how.step2.title", desc: "how.step2.desc" },
  { step: "3", title: "how.step3.title", desc: "how.step3.desc" },
  { step: "4", title: "how.step4.title", desc: "how.step4.desc" },
  { step: "5", title: "how.step5.title", desc: "how.step5.desc" },
] as const;

export async function HowItWorks() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <section id="how-it-works" className={`${publicSectionClass} bg-card`}>
      <div className={publicContainerClass}>
        <SectionHeading
          title={t("how.title")}
          description={t("how.subtitle")}
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stepKeys.map((item) => (
            <li
              key={item.step}
              className={`${publicCardClass} ${publicStaggerItemClass} p-6`}
              style={{ animationDelay: `${Number(item.step) * 80}ms` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {t(item.title)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(item.desc)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
