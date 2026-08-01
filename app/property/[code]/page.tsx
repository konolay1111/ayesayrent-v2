import Link from "next/link";
import { notFound } from "next/navigation";
import { BilingualLabel } from "@/components/BilingualLabel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SectionHeading } from "@/components/SectionHeading";
import { ShortlistButton } from "@/components/ShortlistButton";
import {
  buildPropertyDetailHref,
  formatRentThb,
  formatRoomTypes,
  formatSizeSqm,
  getPublicPropertyDetail,
  getSimilarPublicListings,
} from "@/lib/public-search/queries";

const viewingPolicyPoints = [
  {
    mm: "ကြည့်ရှုရန် ရက်ချိန်ကို ပိုင်ဆိုင်ရှင်နှင့် အတည်ပြုပြီးမှသာ စီစဉ်ပေးပါသည်။",
    en: "The viewing appointment is arranged after owner confirmation.",
  },
  {
    mm: "ကြည့်ရှုပြီးနောက် အခန်းငှားပါက ကြည့်ရှုဝန်ဆောင်ခ မကောက်ခံပါ။",
    en: "If the customer rents the room, the viewing fee is waived.",
  },
  {
    mm: "အတည်ပြုထားသော ကြည့်ရှုမှုသို့ တက်ရောက်ပြီး ကိုယ်ရေးကိုယ်တာ အကြောင်းပြချက်များကြောင့် မငှားပါက သဘောတူညီထားသော ကြည့်ရှုဝန်ဆောင်ခ ကျသင့်ပါသည်။",
    en: "If the customer attends the confirmed viewing but decides not to rent for personal reasons, the agreed viewing service fee applies.",
  },
  {
    mm: "ပိုင်ဆိုင်ရှင်က ပယ်ဖျက်ပါက၊ အခန်းမရရှိနိုင်တော့ပါက သို့မဟုတ် အချက်အလက်များသည် သိသိသာသာ မှားယွင်းနေပါက ဝန်ဆောင်ခ မကောက်ခံပါ။",
    en: "No fee applies if the owner cancels, the room becomes unavailable, or the property information is significantly inaccurate.",
  },
  {
    mm: "ကြည့်ရှုရက် မသတ်မှတ်မီ ဝန်ဆောင်ခနှင့် အခြေအနေများကို ရှင်းလင်းစွာ ရှင်းပြပေးပါသည်။",
    en: "The fee and conditions are explained before the appointment.",
  },
];

function PlaceholderImage({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100 ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        className="h-12 w-12 text-emerald-200 sm:h-16 sm:w-16"
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
  );
}

type PageProps = {
  params: Promise<{ code: string }>;
};

export const dynamic = "force-dynamic";

const notListed = "Not listed";

export default async function PropertyPage({ params }: PageProps) {
  const { code } = await params;
  const propertyId = code.trim();
  const detail = await getPublicPropertyDetail(propertyId);

  if (!detail) {
    notFound();
  }

  const similarListings = detail.area
    ? await getSimilarPublicListings(detail.propertyId, detail.area, 3)
    : [];

  const rentLabel = formatRentThb(detail.lowestMonthlyRent);
  const areaLabel = detail.area ?? notListed;
  const transitLabel = detail.transitName ?? notListed;
  const roomTypeLabel = formatRoomTypes(detail.roomTypes);
  const sizeLabel = formatSizeSqm(detail.sizeSqm);

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-zinc-800">
      <Header />

      <main className="flex-1">
        {/* Property heading */}
        <section className="border-b border-zinc-100 bg-gradient-to-b from-emerald-50/60 to-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-sm font-semibold text-emerald-700">
              {detail.propertyId}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {rentLabel}
              <span className="ml-2 text-base font-normal text-zinc-500">/ လ</span>
            </h1>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              Monthly rent
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-zinc-500">
                  <BilingualLabel myanmar="ဧရိယာ" english="Area" />
                </dt>
                <dd className="mt-0.5 font-medium text-zinc-800">
                  {areaLabel}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">BTS / MRT</dt>
                <dd className="mt-0.5 font-medium text-zinc-800">
                  {transitLabel}
                </dd>
              </div>
            </dl>

            <p className="mt-6 inline-flex rounded-lg bg-amber-50 px-4 py-2.5 text-sm leading-relaxed text-amber-800">
              ရရှိနိုင်မှုကို ပိုင်ဆိုင်ရှင်နှင့် အတည်ပြုပေးပါမည်။
              <span className="mt-0.5 block text-xs text-amber-700/80">
                Availability will be confirmed with the property owner.
              </span>
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Image gallery */}
          <section aria-label="Property photos" className="grid gap-3 sm:grid-cols-4">
            <div className="overflow-hidden rounded-2xl sm:col-span-4 sm:row-span-2">
              <PlaceholderImage className="h-64 sm:h-80 lg:h-96" />
            </div>
            <div className="overflow-hidden rounded-xl">
              <PlaceholderImage className="h-28 sm:h-32" />
            </div>
            <div className="overflow-hidden rounded-xl">
              <PlaceholderImage className="h-28 sm:h-32" />
            </div>
            <div className="overflow-hidden rounded-xl">
              <PlaceholderImage className="h-28 sm:h-32" />
            </div>
            <div className="overflow-hidden rounded-xl">
              <PlaceholderImage className="h-28 sm:h-32" />
            </div>
          </section>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {/* Property information */}
              <section
                aria-labelledby="property-info-heading"
                className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2
                  id="property-info-heading"
                  className="text-lg font-semibold text-zinc-900"
                >
                  <BilingualLabel
                    myanmar="အခန်းအချက်အလက်"
                    english="Property Information"
                  />
                </h2>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">
                      <BilingualLabel myanmar="လစဉ်ငှားရမ်းခ" english="Monthly Rent" />
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-zinc-900">
                      {rentLabel}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">
                      <BilingualLabel
                        myanmar="အခန်းအမျိုးအစား"
                        english="Room Type"
                      />
                    </dt>
                    <dd className="mt-1 font-medium text-zinc-800">
                      {roomTypeLabel}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">
                      <BilingualLabel
                        myanmar="အခန်းအရွယ်အစား"
                        english="Room Size"
                      />
                    </dt>
                    <dd className="mt-1 font-medium text-zinc-800">
                      {sizeLabel}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">
                      <BilingualLabel myanmar="ဧရိယာ" english="Area" />
                    </dt>
                    <dd className="mt-1 font-medium text-zinc-800">
                      {areaLabel}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">BTS / MRT</dt>
                    <dd className="mt-1 font-medium text-zinc-800">
                      {transitLabel}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">
                      <BilingualLabel
                        myanmar="ဘူတာရုံသို့ ခန့်မှန်းခြေ"
                        english="Approximate Travel Time"
                      />
                    </dt>
                    <dd className="mt-1 font-medium text-zinc-800">
                      {notListed}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">
                      <BilingualLabel myanmar="အထပ်" english="Floor" />
                    </dt>
                    <dd className="mt-1 font-medium text-zinc-800">
                      {notListed}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-zinc-50 px-4 py-3">
                    <dt className="text-sm text-zinc-500">
                      <BilingualLabel myanmar="ပစ္စည်းကိရိယာ" english="Furnishing" />
                    </dt>
                    <dd className="mt-1 font-medium text-zinc-800">
                      {notListed}
                    </dd>
                  </div>
                </dl>
              </section>

              {/* Facilities */}
              <section
                aria-labelledby="facilities-heading"
                className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2
                  id="facilities-heading"
                  className="text-lg font-semibold text-zinc-900"
                >
                  <BilingualLabel myanmar="အဆောက်အအုံများ" english="Facilities" />
                </h2>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {detail.amenities.length > 0 ? (
                    detail.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-start gap-2 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-sm"
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        <span>{amenity}</span>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-sm text-zinc-600">
                      {notListed}
                    </li>
                  )}
                </ul>
              </section>

              {/* Privacy notice */}
              <section
                aria-labelledby="privacy-heading"
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8"
              >
                <h2
                  id="privacy-heading"
                  className="text-lg font-semibold text-zinc-900"
                >
                  <BilingualLabel
                    myanmar="ကိုယ်ရေးကိုယ်တာ အချက်အလက် မူဝါဒ"
                    english="Important Privacy Notice"
                  />
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-700">
                  <p>
                    Apartment အမည်များနှင့် တိကျသော လိပ်စာများကို
                    လုံခြုံရေးအတွက် မဖော်ပြပါ။
                    <span className="mt-1 block text-zinc-500">
                      Apartment names and exact addresses are kept private.
                    </span>
                  </p>
                  <p>
                    အခန်းလွတ်ရှိမရှိ အတည်ပြုပြီးမှသာ အသေးစိတ်အချက်အလက်များကို
                    မျှဝေပေးပါသည်။
                    <span className="mt-1 block text-zinc-500">
                      Full details are shared after availability is confirmed.
                    </span>
                  </p>
                  <p>
                    ဤလုပ်ငန်းစဉ်သည် ပိုင်ဆိုင်ရှင်များနှင့် AyesayRent ၏
                    ဝန်ဆောင်မှုလုပ်ငန်းစဉ်ကို ကာကွယ်ပေးပါသည်။
                    <span className="mt-1 block text-zinc-500">
                      This protects property owners and AyesayRent&apos;s service
                      process.
                    </span>
                  </p>
                </div>
              </section>

              {/* Viewing service policy */}
              <section
                aria-labelledby="viewing-policy-heading"
                className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2
                  id="viewing-policy-heading"
                  className="text-lg font-semibold text-zinc-900"
                >
                  <BilingualLabel
                    myanmar="ကြည့်ရှုဝန်ဆောင်မှု မူဝါဒ အကျဉ်းချုပ်"
                    english="Viewing Service Policy Summary"
                  />
                </h2>

                <ul className="mt-6 space-y-4">
                  {viewingPolicyPoints.map((point) => (
                    <li key={point.en} className="flex gap-3">
                      <span
                        className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <p className="text-sm leading-relaxed text-zinc-700">
                        {point.mm}
                        <span className="mt-1 block text-zinc-500">{point.en}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Availability sidebar */}
            <aside className="lg:col-span-1">
              <section
                aria-labelledby="availability-heading"
                className="sticky top-24 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 shadow-sm sm:p-8"
              >
                <h2
                  id="availability-heading"
                  className="text-lg font-semibold text-emerald-900"
                >
                  အခန်းလွတ်ရှိမရှိ စစ်ဆေးရန်
                </h2>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  Check Availability
                </p>

                <p className="mt-4 text-sm leading-relaxed text-emerald-800">
                  AyesayRent သည် ပိုင်ဆိုင်ရှင်နှင့် ဆက်သွယ်၍ နောက်ဆုံး
                  အခန်းလွတ်ရှိမရှိ၊ ငှားရမ်းခ၊ အခြေအနေများနှင့်
                  ကြည့်ရှုရန် အချိန်များကို အတည်ပြုပေးပါသည်။
                </p>
                <p className="mt-2 text-xs leading-relaxed text-emerald-700/80">
                  AyesayRent will contact the property owner and confirm the
                  latest room availability, rent, conditions, and viewing times.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    className="inline-flex h-11 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <span>ရရှိနိုင်မှု စစ်ဆေးရန်</span>
                    <span className="text-xs font-normal text-emerald-100">
                      Check Availability
                    </span>
                  </button>
                  <ShortlistButton
                    propertyCode={detail.propertyId}
                    className="inline-flex h-11 w-full flex-col items-center justify-center rounded-xl border border-emerald-200 bg-white text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                  />
                  <button
                    type="button"
                    className="inline-flex h-11 w-full flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    <span>အကြံပေးနှင့် ဆက်သွယ်ရန်</span>
                    <span className="text-xs font-normal text-zinc-500">
                      Contact Consultant
                    </span>
                  </button>
                </div>
              </section>
            </aside>
          </div>

          {/* Similar properties */}
          <section
            aria-labelledby="similar-heading"
            className="mt-16 border-t border-zinc-100 pt-16"
          >
            <SectionHeading
              myanmar="ဆင်တူသော အခန်းများ"
              english="Similar Properties"
            />

            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similarListings.map((listing) => (
                <li key={listing.propertyId}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                    <PlaceholderImage className="h-36" />

                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-mono text-sm font-semibold text-emerald-700">
                        {listing.publicReference}
                      </p>
                      <p className="mt-2 text-xl font-bold text-zinc-900">
                        {formatRentThb(listing.lowestMonthlyRent)}
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
                            {listing.area ?? notListed}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt className="text-zinc-500">BTS / MRT</dt>
                          <dd className="text-right font-medium text-zinc-800">
                            {listing.transitName ?? notListed}
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
                            {formatRoomTypes(listing.matchingRoomTypes)}
                          </dd>
                        </div>
                      </dl>

                      <Link
                        href={buildPropertyDetailHref(listing.propertyId)}
                        className="mt-4 inline-flex h-11 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                      >
                        <span>အသေးစိတ်ကြည့်ရန်</span>
                        <span className="text-xs font-normal text-emerald-100">
                          View Details
                        </span>
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
