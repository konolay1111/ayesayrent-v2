import Link from "next/link";
import { ShortlistButton } from "@/components/ShortlistButton";

const searchFilters = {
  area: "Lat Phrao",
  areaMm: "လတ်ပါး",
  transit: "MRT Lat Phrao",
  rentRange: "฿7,001–฿10,000",
  roomType: "Any",
};

const searchResults = [
  {
    code: "AYR-LAD-001",
    rent: "฿8,500",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    travelTime: "5 min walk",
    travelTimeMm: "လမ်းလျှောက် ၅ မိနစ်",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
    size: "28 sqm",
    facilities: ["Air conditioning", "WiFi", "Refrigerator"],
    facilitiesMm: ["ရေအေးပေးစက်", "WiFi", "ရေခဲသေတ္တာ"],
  },
  {
    code: "AYR-LAD-015",
    rent: "฿9,200",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    travelTime: "7 min walk",
    travelTimeMm: "လမ်းလျှောက် ၇ မိနစ်",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
    size: "30 sqm",
    facilities: ["Air conditioning", "Swimming pool", "Fitness room"],
    facilitiesMm: ["ရေအေးပေးစက်", "ရေကူးကန်", "အားကစားခန်း"],
  },
  {
    code: "AYR-LAD-028",
    rent: "฿9,800",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    travelTime: "4 min walk",
    travelTimeMm: "လမ်းလျှောက် ၄ မိနစ်",
    roomType: "1 Bedroom",
    roomTypeMm: "တစ်ခန်းမ-bedroom",
    size: "32 sqm",
    facilities: ["Air conditioning", "WiFi", "Washing machine"],
    facilitiesMm: ["ရေအေးပေးစက်", "WiFi", "အဝတ်လျှော်စက်"],
  },
  {
    code: "AYR-LAD-041",
    rent: "฿7,500",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    travelTime: "10 min walk",
    travelTimeMm: "လမ်းလျှောက် ၁၀ မိနစ်",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
    size: "26 sqm",
    facilities: ["Air conditioning", "WiFi"],
    facilitiesMm: ["ရေအေးပေးစက်", "WiFi"],
  },
  {
    code: "AYR-LAD-052",
    rent: "฿10,000",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    travelTime: "6 min walk",
    travelTimeMm: "လမ်းလျှောက် ၆ မိနစ်",
    roomType: "1 Bedroom",
    roomTypeMm: "တစ်ခန်းမ-bedroom",
    size: "35 sqm",
    facilities: ["Air conditioning", "WiFi", "Balcony"],
    facilitiesMm: ["ရေအေးပေးစက်", "WiFi", "မျက်နှာကျက်"],
  },
];

function BilingualLabel({
  myanmar,
  english,
}: {
  myanmar: string;
  english: string;
}) {
  return (
    <span className="flex flex-col gap-0.5">
      <span>{myanmar}</span>
      <span className="text-xs font-normal text-zinc-500">{english}</span>
    </span>
  );
}

export default function SearchPage() {
  const resultCount = searchResults.length;

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-zinc-800">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="/"
            className="shrink-0 text-xl font-bold tracking-tight text-emerald-600"
          >
            AyesayRent
          </a>

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            <a
              href="/"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
            >
              <BilingualLabel myanmar="ပင်မ" english="Home" />
            </a>
            <a
              href="/search"
              className="text-sm font-medium text-emerald-600"
              aria-current="page"
            >
              <BilingualLabel myanmar="အခန်းရှာရန်" english="Search" />
            </a>
            <a
              href="/#how-it-works"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
            >
              <BilingualLabel myanmar="လုပ်ဆောင်ပုံ" english="How It Works" />
            </a>
            <a
              href="/#contact"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
            >
              <BilingualLabel myanmar="ဆက်သွယ်ရန်" english="Contact" />
            </a>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
              aria-current="true"
            >
              မြန်မာ
            </span>
            <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500">
              English
            </span>
          </div>

          <details className="group relative lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-center rounded-lg border border-zinc-200 p-2 [&::-webkit-details-marker]:hidden">
              <svg
                className="h-5 w-5 text-zinc-700"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <span className="sr-only">Open menu</span>
            </summary>
            <nav
              className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-100 bg-white py-2 shadow-lg"
              aria-label="Mobile navigation"
            >
              <a
                href="/"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <BilingualLabel myanmar="ပင်မ" english="Home" />
              </a>
              <a
                href="/search"
                className="block px-4 py-2.5 text-sm font-medium text-emerald-600"
                aria-current="page"
              >
                <BilingualLabel myanmar="အခန်းရှာရန်" english="Search" />
              </a>
              <a
                href="/#how-it-works"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <BilingualLabel myanmar="လုပ်ဆောင်ပုံ" english="How It Works" />
              </a>
              <a
                href="/#contact"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <BilingualLabel myanmar="ဆက်သွယ်ရန်" english="Contact" />
              </a>
              <div className="mt-2 flex gap-2 border-t border-zinc-100 px-4 pt-3">
                <span className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                  မြန်မာ
                </span>
                <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500">
                  English
                </span>
              </div>
            </nav>
          </details>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. Page heading */}
        <section className="border-b border-zinc-100 bg-gradient-to-b from-emerald-50/60 to-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              သင့်ရှာဖွေမှုနှင့် ကိုက်ညီသော အခန်းများ
            </h1>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              Apartments matching your search
            </p>
            <p className="mt-4 inline-flex rounded-lg bg-amber-50 px-4 py-2.5 text-sm leading-relaxed text-amber-800">
              ရရှိနိုင်မှုကို ပိုင်ဆိုင်ရှင်နှင့် အတည်ပြုပေးပါမည်။
              <span className="mt-0.5 block text-xs text-amber-700/80">
                Availability will be confirmed with the property owner.
              </span>
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 3. Search filter panel */}
          <section
            aria-labelledby="filter-heading"
            className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 id="filter-heading" className="mb-6 text-lg font-semibold text-zinc-900">
              <BilingualLabel myanmar="ရှာဖွေမှု စစ်ထုတ်ရန်" english="Search Filters" />
            </h2>
            <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="area" className="text-sm font-medium text-zinc-700">
                  <BilingualLabel myanmar="ဧရိယာ" english="Area" />
                </label>
                <select
                  id="area"
                  name="area"
                  className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  defaultValue="latphrao"
                >
                  <option value="latphrao">Lat Phrao / လတ်ပါး</option>
                  <option value="sukhumvit">Sukhumvit / ဆွတ်ခומဗစ်</option>
                  <option value="silom">Silom / Sathorn</option>
                  <option value="ari">Ari / Phaya Thai</option>
                  <option value="thonglor">Thonglor / Ekkamai</option>
                  <option value="rama9">Rama 9 / Ratchada</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="transit" className="text-sm font-medium text-zinc-700">
                  BTS / MRT
                </label>
                <select
                  id="transit"
                  name="transit"
                  className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  defaultValue="lat-phrao"
                >
                  <option value="lat-phrao">MRT Lat Phrao</option>
                  <option value="asok">Asok BTS</option>
                  <option value="nana">Nana BTS</option>
                  <option value="phrom-phong">Phrom Phong BTS</option>
                  <option value="thong-lo">Thong Lo BTS</option>
                  <option value="ari">Ari BTS</option>
                  <option value="phra-ram9">Phra Ram 9 MRT</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="rent" className="text-sm font-medium text-zinc-700">
                  <BilingualLabel myanmar="လစဉ်ငှားရမ်းခ" english="Monthly Rent" />
                </label>
                <select
                  id="rent"
                  name="rent"
                  className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  defaultValue="7k-10k"
                >
                  <option value="under-5k">฿5,000 အောက်</option>
                  <option value="5k-7k">฿5,000–฿7,000</option>
                  <option value="7k-10k">฿7,001–฿10,000</option>
                  <option value="10k-15k">฿10,001–฿15,000</option>
                  <option value="above-15k">฿15,000 အထက်</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="room-type" className="text-sm font-medium text-zinc-700">
                  <BilingualLabel myanmar="အခန်းအမျိုးအစား" english="Room Type" />
                </label>
                <select
                  id="room-type"
                  name="roomType"
                  className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  defaultValue="any"
                >
                  <option value="any">Any / အားလုံး</option>
                  <option value="studio">Studio / စတူဒီယို</option>
                  <option value="1br">1 Bedroom / တစ်ခန်းမ-bedroom</option>
                  <option value="2br">2 Bedroom / နှစ်ခန်းမ-bedroom</option>
                  <option value="3br">3+ Bedroom</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex h-11 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <span>အခန်းရှာရန်</span>
                  <span className="text-xs font-normal text-emerald-100">Search</span>
                </button>
              </div>
            </form>
          </section>

          {/* 4. Results summary */}
          <section aria-live="polite" className="mt-8">
            <p className="text-sm font-medium text-zinc-700">
              {searchFilters.areaMm} ({searchFilters.area}) • {searchFilters.transit}{" "}
              • {searchFilters.rentRange}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {resultCount} ခု တွေ့ရှိပါသည်
              <span className="ml-1">· {resultCount} properties found</span>
            </p>
            <Link
              href="/shortlist"
              className="mt-3 inline-flex h-10 flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
            >
              <span>ရွေးချယ်စာရင်း ကြည့်ရန်</span>
              <span className="text-xs font-normal text-emerald-600/80">
                View Shortlist
              </span>
            </Link>
          </section>

          {/* 6. Shortlist information box */}
          <aside className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-emerald-900">
              ရွေးချယ်စာရင်း (Shortlist)
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-emerald-800">
              သင်နှစ်သက်သော အခန်းများကို ရွေးချယ်ပါ။ AyesayRent သည်
              ကြည့်ရှုရန် မစီစဉ်မီ ပိုင်ဆိုင်ရှင်တိုင်း၏ ရရှိနိုင်မှုကို
              အတည်ပြုပေးပါမည်။
            </p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-700/80">
              Select the apartments you like. AyesayRent will confirm availability
              with each owner before arranging a viewing.
            </p>
          </aside>

          {/* 5. Property cards */}
          <section aria-labelledby="results-heading" className="mt-8">
            <h2 id="results-heading" className="sr-only">
              Search results
            </h2>
            <ul className="grid gap-6 lg:grid-cols-2">
              {searchResults.map((property) => (
                <li key={property.code}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <div
                      className="flex h-52 items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100 sm:h-56"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-16 w-16 text-emerald-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        />
                      </svg>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <p className="font-mono text-sm font-semibold text-emerald-700">
                        {property.code}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-zinc-900">
                        {property.rent}
                        <span className="ml-1 text-sm font-normal text-zinc-500">/ လ</span>
                      </p>

                      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-zinc-500">
                            <BilingualLabel myanmar="ဧရိယာ" english="Area" />
                          </dt>
                          <dd className="mt-0.5 font-medium text-zinc-800">
                            {property.areaMm} ({property.area})
                          </dd>
                        </div>
                        <div>
                          <dt className="text-zinc-500">BTS / MRT</dt>
                          <dd className="mt-0.5 font-medium text-zinc-800">
                            {property.transit}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-zinc-500">
                            <BilingualLabel
                              myanmar="ဘူတာရုံသို့ ခန့်မှန်းခြေ"
                              english="Travel Time"
                            />
                          </dt>
                          <dd className="mt-0.5 font-medium text-zinc-800">
                            {property.travelTimeMm} ({property.travelTime})
                          </dd>
                        </div>
                        <div>
                          <dt className="text-zinc-500">
                            <BilingualLabel
                              myanmar="အခန်းအမျိုးအစား"
                              english="Room Type"
                            />
                          </dt>
                          <dd className="mt-0.5 font-medium text-zinc-800">
                            {property.roomTypeMm} ({property.roomType})
                          </dd>
                        </div>
                        <div>
                          <dt className="text-zinc-500">
                            <BilingualLabel
                              myanmar="အခန်းအရွယ်အစား"
                              english="Room Size"
                            />
                          </dt>
                          <dd className="mt-0.5 font-medium text-zinc-800">
                            {property.size}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-zinc-500">
                            <BilingualLabel
                              myanmar="အဓိက အဆောက်အအုံများ"
                              english="Key Facilities"
                            />
                          </dt>
                          <dd className="mt-1.5 flex flex-wrap gap-1.5">
                            {property.facilitiesMm.map((facility, index) => (
                              <span
                                key={facility}
                                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700"
                              >
                                {facility}
                                <span className="text-zinc-500">
                                  {" "}
                                  ({property.facilities[index]})
                                </span>
                              </span>
                            ))}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                        ရရှိနိုင်မှုကို ပိုင်ဆိုင်ရှင်နှင့် အတည်ပြုပေးပါမည်။
                        <span className="mt-0.5 block text-amber-700/80">
                          Availability will be confirmed with the property owner.
                        </span>
                      </p>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Link
                          href={`/property/${property.code}`}
                          className="inline-flex h-11 flex-1 flex-col items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          <span>အသေးစိတ်ကြည့်ရန်</span>
                          <span className="text-xs font-normal text-emerald-100">
                            View Details
                          </span>
                        </Link>
                        <ShortlistButton propertyCode={property.code} />
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          {/*
            7. Empty-state example — show when searchResults.length === 0

            <section className="mt-8 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-16 text-center">
              <p className="text-lg font-semibold text-zinc-900">
                ကိုက်ညီသော အခန်းများ မတွေ့ရှိပါ
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                No matching apartments found. Contact our consultant for help.
              </p>
              <a
                href="/#contact"
                className="mt-6 inline-flex h-11 flex-col items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <span>အကြံပေးနှင့် ဆက်သွယ်ရန်</span>
                <span className="text-xs font-normal text-emerald-100">Contact Consultant</span>
              </a>
            </section>
          */}
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold text-emerald-600">AyesayRent</p>
          <p className="mt-1 text-xs text-zinc-500">
            © {new Date().getFullYear()} AyesayRent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
