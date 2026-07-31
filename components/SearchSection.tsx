import Link from "next/link";
import { getServerLocale } from "@/lib/i18n/server";
import { translate } from "@/lib/i18n/translations";
import { IconSearch } from "@/components/icons";
import { getButtonClassName } from "@/components/ui/Button";
import {
  publicContainerClass,
  publicInputClass,
  publicSearchPanelClass,
  publicSectionClass,
  publicSelectClass,
  typeH2Class,
  typeLabelClass,
  typeSmallClass,
} from "@/lib/public-ui";

export async function SearchSection() {
  const locale = await getServerLocale();
  const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  return (
    <section id="search" className={`${publicSectionClass} bg-background`}>
      <div className={publicContainerClass}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={typeH2Class}>{t("search.title")}</h2>
          <p className={`mt-4 ${typeSmallClass}`}>{t("search.subtitle")}</p>
        </div>

        <div className={`mx-auto mt-12 max-w-5xl ${publicSearchPanelClass}`}>
          <form
            action="/search"
            method="get"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="home-area" className={typeLabelClass}>
                {t("search.area")}
              </label>
              <input
                id="home-area"
                name="area"
                type="text"
                placeholder="Ladprao"
                className={publicInputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="home-station" className={typeLabelClass}>
                {t("search.station")}
              </label>
              <input
                id="home-station"
                name="station"
                type="text"
                placeholder="MRT Lat Phrao"
                className={publicInputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="home-minRent" className={typeLabelClass}>
                {t("search.minRent")}
              </label>
              <input
                id="home-minRent"
                name="minRent"
                type="number"
                min={0}
                step={500}
                inputMode="numeric"
                placeholder="5000"
                className={publicInputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="home-maxRent" className={typeLabelClass}>
                {t("search.maxRent")}
              </label>
              <input
                id="home-maxRent"
                name="maxRent"
                type="number"
                min={0}
                step={500}
                inputMode="numeric"
                placeholder="12000"
                className={publicInputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="home-pet" className={typeLabelClass}>
                {t("search.pet")}
              </label>
              <select id="home-pet" name="pet" className={publicSelectClass}>
                <option value="">{t("search.petAll")}</option>
                <option value="true">{t("search.petYes")}</option>
                <option value="false">{t("search.petNo")}</option>
              </select>
            </div>

            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                className={getButtonClassName("primary", "lg", "w-full")}
              >
                <IconSearch size={18} />
                {t("search.submit")}
              </button>
            </div>
          </form>

          <p className={`mt-8 text-center ${typeSmallClass}`}>
            <Link
              href="/search"
              className="font-semibold text-primary transition-colors hover:underline"
            >
              {t("search.advanced")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
