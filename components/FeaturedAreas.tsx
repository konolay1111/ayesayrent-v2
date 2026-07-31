import Link from "next/link";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { SectionHeading } from "./SectionHeading";
import { publicCardInteractiveClass, publicContainerClass, publicSectionClass } from "@/lib/public-ui";

const featuredAreas = [
  { name: "Ladprao", href: "/search?area=Ladprao", descKey: "areas.ladprao.desc" as const },
  {
    name: "Ramkhamhaeng",
    href: "/search?area=Ramkhamhaeng",
    descKey: "areas.ramkhamhaeng.desc" as const,
  },
  { name: "Bangkapi", href: "/search?area=Bangkapi", descKey: "areas.bangkapi.desc" as const },
  { name: "Bang Phli", href: "/search?area=Bang%20Phli", descKey: "areas.bangPhli.desc" as const },
  {
    name: "Samut Prakan",
    href: "/search?area=Samut%20Prakan",
    descKey: "areas.samutPrakan.desc" as const,
  },
];

export async function FeaturedAreas() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <section id="featured-areas" className={`${publicSectionClass} bg-card`}>
      <div className={publicContainerClass}>
        <SectionHeading title={t("areas.title")} description={t("areas.subtitle")} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredAreas.map((area) => (
            <Link
              key={area.name}
              href={area.href}
              className={`${publicCardInteractiveClass} group block p-6`}
            >
              <p className="text-lg font-semibold text-foreground group-hover:text-primary">
                {area.name}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{t(area.descKey)}</p>
              <p className="mt-4 text-sm font-semibold text-primary">{t("areas.searchLink")}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
