import { BilingualLabel } from "./BilingualLabel";
import { SectionHeading } from "./SectionHeading";

const featuredProperties = [
  {
    code: "AYR-LAD-001",
    rent: "฿8,500",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
    size: "28 sqm",
  },
  {
    code: "AYR-SUK-002",
    rent: "฿12,000",
    area: "Sukhumvit",
    areaMm: "ဆွတ်ခומဗစ်",
    transit: "BTS Phrom Phong",
    roomType: "1 Bedroom",
    roomTypeMm: "တစ်ခန်းမ-bedroom",
    size: "35 sqm",
  },
  {
    code: "AYR-ARI-003",
    rent: "฿6,500",
    area: "Ari",
    areaMm: "အရီ",
    transit: "BTS Ari",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
    size: "24 sqm",
  },
];

export function FeaturedProperties() {
  return (
    <section
      id="featured"
      className="px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          myanmar="အခန်းများ နမူနာ"
          english="Featured Apartments"
          descriptionMm="ရရှိနိုင်မှုကို ပိုင်ဆိုင်ရှင်နှင့် အတည်ပြုပြီးမှသာ အတည်ပြုနိုင်ပါသည်"
          description="Sample listings — availability is never shown as confirmed"
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <article
              key={property.code}
              className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100"
                aria-hidden="true"
              >
                <svg
                  className="h-12 w-12 text-emerald-200"
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

              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-sm font-semibold text-emerald-700">
                  {property.code}
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-900">
                  {property.rent}
                  <span className="ml-1 text-sm font-normal text-zinc-500">
                    / လ
                  </span>
                </p>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-zinc-500">
                      <BilingualLabel myanmar="ဧရိယာ" english="Area" />
                    </dt>
                    <dd className="text-right font-medium text-zinc-800">
                      {property.areaMm} ({property.area})
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-zinc-500">BTS / MRT</dt>
                    <dd className="text-right font-medium text-zinc-800">
                      {property.transit}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-zinc-500">
                      <BilingualLabel
                        myanmar="အခန်းအမျိုးအစား"
                        english="Room Type"
                      />
                    </dt>
                    <dd className="text-right font-medium text-zinc-800">
                      {property.roomTypeMm} ({property.roomType})
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-zinc-500">
                      <BilingualLabel
                        myanmar="အခန်းအရွယ်အစား"
                        english="Room Size"
                      />
                    </dt>
                    <dd className="text-right font-medium text-zinc-800">
                      {property.size}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                  ရရှိနိုင်မှုကို ပိုင်ဆိုင်ရှင်နှင့် အတည်ပြုပေးပါမည်။
                  <span className="mt-0.5 block text-amber-700/80">
                    Availability will be confirmed with the property owner.
                  </span>
                </p>

                <button
                  type="button"
                  className="mt-4 inline-flex h-11 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <span>ရရှိနိုင်မှု စစ်ဆေးရန်</span>
                  <span className="text-xs font-normal text-emerald-100">
                    Check Availability
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
