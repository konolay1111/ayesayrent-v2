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

function SectionHeading({
  myanmar,
  english,
  description,
  descriptionMm,
}: {
  myanmar: string;
  english: string;
  description?: string;
  descriptionMm?: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        {myanmar}
      </h2>
      <p className="mt-1 text-sm font-medium text-emerald-600">{english}</p>
      {(descriptionMm || description) && (
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-zinc-600">
          {descriptionMm}
          {descriptionMm && description && (
            <span className="mt-1 block text-sm text-zinc-500">{description}</span>
          )}
          {!descriptionMm && description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-zinc-800">
      {/* 1. Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="#home"
            className="shrink-0 text-xl font-bold tracking-tight text-emerald-600"
          >
            AyesayRent
          </a>

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            <a
              href="#home"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
            >
              <BilingualLabel myanmar="ပင်မ" english="Home" />
            </a>
            <a
              href="#search"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
            >
              <BilingualLabel myanmar="အခန်းရှာရန်" english="Search" />
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-emerald-600"
            >
              <BilingualLabel myanmar="လုပ်ဆောင်ပုံ" english="How It Works" />
            </a>
            <a
              href="#contact"
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
                href="#home"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <BilingualLabel myanmar="ပင်မ" english="Home" />
              </a>
              <a
                href="#search"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <BilingualLabel myanmar="အခန်းရှာရန်" english="Search" />
              </a>
              <a
                href="#how-it-works"
                className="block px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600"
              >
                <BilingualLabel myanmar="လုပ်ဆောင်ပုံ" english="How It Works" />
              </a>
              <a
                href="#contact"
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
        {/* 2. Hero */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-b from-emerald-50/80 to-white px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-50 blur-3xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              ထိုင်းနိုင်ငံတွင် သင့်အတွက် သင့်တော်သော အခန်းကို ရှာဖွေပါ
            </h1>
            <p className="mt-3 text-base font-medium text-emerald-600 sm:text-lg">
              Find the Right Apartment in Thailand
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              AyesayRent သည် ထိုင်းနိုင်ငံရှိ မြန်မာလူမျိုးများအတွက်
              ယုံကြည်စိတ်ချရသော အခန်းငှားဝန်ဆောင်မှု ပေးပါသည်။
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              AyesayRent provides trusted rental assistance for Myanmar people
              living in Thailand.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#search"
                className="inline-flex h-12 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
              >
                <span>အခန်းရှာရန်</span>
                <span className="text-xs font-normal text-emerald-100">
                  Search Apartments
                </span>
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 w-full flex-col items-center justify-center rounded-xl border border-emerald-200 bg-white px-8 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 sm:w-auto"
              >
                <span>အကြံပေးနှင့် ဆက်သွယ်ရန်</span>
                <span className="text-xs font-normal text-emerald-600/70">
                  Contact Consultant
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. Apartment Search Card */}
        <section id="search" className="-mt-12 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-200/50 sm:p-8">
              <h2 className="mb-6 text-lg font-semibold text-zinc-900">
                <BilingualLabel
                  myanmar="အခန်းရှာရန်"
                  english="Search Apartments"
                />
              </h2>
              <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="area"
                    className="text-sm font-medium text-zinc-700"
                  >
                    <BilingualLabel myanmar="ဧရိယာ" english="Area" />
                  </label>
                  <select
                    id="area"
                    name="area"
                    className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      ဧရိယာ ရွေးချယ်ပါ
                    </option>
                    <option value="sukhumvit">Sukhumvit / ဆွတ်ခומဗစ်</option>
                    <option value="silom">Silom / Sathorn</option>
                    <option value="ari">Ari / Phaya Thai</option>
                    <option value="thonglor">Thonglor / Ekkamai</option>
                    <option value="rama9">Rama 9 / Ratchada</option>
                    <option value="latphrao">Lat Phrao / Chatuchak</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="transit"
                    className="text-sm font-medium text-zinc-700"
                  >
                    BTS / MRT
                  </label>
                  <select
                    id="transit"
                    name="transit"
                    className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      ဘူတာရုံ ရွေးချယ်ပါ
                    </option>
                    <option value="asok">Asok BTS</option>
                    <option value="nana">Nana BTS</option>
                    <option value="phrom-phong">Phrom Phong BTS</option>
                    <option value="thong-lo">Thong Lo BTS</option>
                    <option value="ari">Ari BTS</option>
                    <option value="lat-phrao">Lat Phrao MRT</option>
                    <option value="phra-ram9">Phra Ram 9 MRT</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="rent"
                    className="text-sm font-medium text-zinc-700"
                  >
                    <BilingualLabel
                      myanmar="လစဉ်ငှားရမ်းခ"
                      english="Monthly Rent"
                    />
                  </label>
                  <select
                    id="rent"
                    name="rent"
                    className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      ငှားရမ်းခ ရွေးချယ်ပါ
                    </option>
                    <option value="under-5k">฿5,000 အောက်</option>
                    <option value="5k-7k">฿5,000–฿7,000</option>
                    <option value="7k-10k">฿7,001–฿10,000</option>
                    <option value="10k-15k">฿10,001–฿15,000</option>
                    <option value="above-15k">฿15,000 အထက်</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="room-type"
                    className="text-sm font-medium text-zinc-700"
                  >
                    <BilingualLabel
                      myanmar="အခန်းအမျိုးအစား"
                      english="Room Type"
                    />
                  </label>
                  <select
                    id="room-type"
                    name="roomType"
                    className="h-11 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      အခန်းအမျိုးအစား ရွေးချယ်ပါ
                    </option>
                    <option value="studio">Studio / စတူဒီယို</option>
                    <option value="1br">1 Bedroom / တစ်ခန်းမ-bedroom</option>
                    <option value="2br">2 Bedroom / နှစ်ခန်းမ-bedroom</option>
                    <option value="3br">3+ Bedroom</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-4">
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 sm:w-auto"
                  >
                    <span>အခန်းရှာရန်</span>
                    <span className="text-xs font-normal text-emerald-100">
                      Search Apartments
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 4. How It Works */}
        <section
          id="how-it-works"
          className="bg-zinc-50/80 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              myanmar="လုပ်ဆောင်ပုံ"
              english="How It Works"
              descriptionMm="AyesayRent နှင့် အခန်းရှာဖွေခြင်း လွယ်ကူသော ၄ ချက်စီလုပ်ဆောင်ပါ"
              description="Four simple steps to find your apartment with AyesayRent"
            />

            <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "1",
                  titleMm: "အခန်းရှာပါ",
                  titleEn: "Search apartments",
                  descMm:
                    "ဧရိယာ၊ BTS/MRT၊ ငှားရမ်းခနှင့် အခန်းအမျိုးအစားဖြင့် သင့်လိုအပ်ချက်နှင့် ကိုက်ညီသော အခန်းများကို ရှာပါ။",
                  descEn:
                    "Filter by area, BTS/MRT station, budget, and room type.",
                },
                {
                  step: "2",
                  titleMm: "ပိုင်ဆိုင်မှု ကုဒ်ရွေးပါ",
                  titleEn: "Select property codes",
                  descMm:
                    "သင့်စိတ်ဝင်စားသော အခန်းများ၏ ပိုင်ဆိုင်မှု ကုဒ်များကို ရွေးချယ်ပါ။",
                  descEn:
                    "Choose the property codes of apartments that interest you.",
                },
                {
                  step: "3",
                  titleMm: "ရရှိနိုင်မှု အတည်ပြုပါ",
                  titleEn: "Confirm availability",
                  descMm:
                    "AyesayRent သည် ပိုင်ဆိုင်ရှင်နှင့် ဆက်သွယ်၍ ရရှိနိုင်မှုကို အတည်ပြုပေးပါသည်။",
                  descEn:
                    "AyesayRent confirms availability with the property owner.",
                },
                {
                  step: "4",
                  titleMm: "ကြည့်ရှုရန် စီစဉ်ပါ",
                  titleEn: "Arrange a viewing",
                  descMm:
                    "ရရှိနိုင်မှု အတည်ပြုပြီးနောက် ကြည့်ရှုရန် ရက်ချိန်ကို စီစဉ်ပေးပါသည်။",
                  descEn:
                    "Once confirmed, we arrange a convenient viewing appointment.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                    {item.titleMm}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-emerald-600">
                    {item.titleEn}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                    {item.descMm}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {item.descEn}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. Featured Apartment Preview */}
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

        {/* 6. Viewing Service Policy */}
        <section
          id="viewing-policy"
          className="bg-zinc-50/80 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              myanmar="ကြည့်ရှုဝန်ဆောင်မှု မူဝါဒ"
              english="Viewing Service Policy"
            />

            <div className="mt-10 space-y-5 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
              {[
                {
                  mm: "AyesayRent သည် ပိုင်ဆိုင်ရှင်နှင့် ဆက်သွယ်၍ ကြည့်ရှုရန် ရက်ချိန်ကို အတည်ပြုပေးပါသည်။",
                  en: "AyesayRent confirms your viewing appointment directly with the property owner.",
                },
                {
                  mm: "ကြည့်ရှုပြီးနောက် အခန်းငှားပါက ကြည့်ရှုဝန်ဆောင်ခ မကောက်ခံပါ။",
                  en: "If you rent the room after viewing, the viewing service fee is waived.",
                },
                {
                  mm: "အတည်ပြုထားသော ကြည့်ရှုမှုသို့ တက်ရောက်ပြီး ကိုယ်ရေးကိုယ်တာ အကြောင်းပြချက်များကြောင့် မငှားပါက သဘောတူညီထားသော ကြည့်ရှုဝန်ဆောင်ခ ကျသင့်ပါသည်။",
                  en: "If you attend the confirmed viewing but choose not to rent for personal reasons, the agreed viewing service fee applies.",
                },
                {
                  mm: "ကြည့်ရှုရက် မသတ်မှတ်မီ ဝန်ဆောင်ခနှင့် အခြေအနေများကို ရှင်းလင်းစွာ ရှင်းပြပေးပါသည်။",
                  en: "Fees and conditions are clearly explained before your appointment is scheduled.",
                },
                {
                  mm: "ပိုင်ဆိုင်ရှင်က ပယ်ဖျက်ပါက၊ အခန်းမရရှိနိုင်တော့ပါက သို့မဟုတ် အချက်အလက်များသည် သိသိသာသာ မှားယွင်းနေပါက ဝန်ဆောင်ခ မကောက်ခံပါ။",
                  en: "No fee applies if the owner cancels, the room becomes unavailable, or the property information is significantly inaccurate.",
                },
              ].map((point, index) => (
                <div key={index} className="flex gap-3">
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Why Choose AyesayRent */}
        <section id="why-us" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              myanmar="AyesayRent ကို ဘာကြောင့် ရွေးချယ်သင့်သလဲ"
              english="Why Choose AyesayRent"
              descriptionMm="ထိုင်းနိုင်ငံတွင် မြန်မာလူမျိုးများအတွက် ယုံကြည်စိတ်ချရသော အခန်းငှားဝန်ဆောင်မှု"
              description="Trusted rental assistance designed for Myanmar people in Thailand"
            />

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-zinc-900">
                  မြန်မာဘာသာ ပံ့ပိုးမှု
                </h3>
                <p className="mt-0.5 text-sm font-medium text-emerald-600">
                  Myanmar language support
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  မြန်မာဘာသာဖြင့် ရှင်းလင်းစွာ ဆက်သွယ်နိုင်ပြီး
                  အခန်းရှာဖွေခြင်း လုပ်ငန်းစဉ်တစ်ခုလုံးကို
                  နားလည်လွယ်အောင် ကူညီပေးပါသည်။
                </p>
              </article>

              <article className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-zinc-900">
                  ပိုင်ဆိုင်ရှင် ရရှိနိုင်မှု အတည်ပြုခြင်း
                </h3>
                <p className="mt-0.5 text-sm font-medium text-emerald-600">
                  Owner availability confirmation
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  ရရှိနိုင်မှုကို ပိုင်ဆိုင်ရှင်နှင့် တိုက်ရိုက်
                  အတည်ပြုပြီးမှသာ ဆက်လက်လုပ်ဆောင်ပါသည်။
                  အတည်မပြုရသေးသော အချက်အလက်များကို မဖော်ပြပါ။
                </p>
              </article>

              <article className="rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md sm:col-span-2 lg:col-span-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-zinc-900">
                  ယုံကြည်စိတ်ချရသော ကြည့်ရှုအကူအညီ
                </h3>
                <p className="mt-0.5 text-sm font-medium text-emerald-600">
                  Trusted viewing assistance
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  ကြည့်ရှုရက် စီစဉ်ခြင်းမှ စတင်ကာ
                  ကြည့်ရှုမှုအထိ တာဝန်ယူမှုရှိသော
                  အကြံပေးဝန်ဆောင်မှု ပေးပါသည်။
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 8. Contact */}
        <section id="contact" className="bg-zinc-50/80 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              myanmar="ဆက်သွယ်ရန်"
              english="Contact"
              descriptionMm="AyesayRent အကြံပေးနှင့် ဆက်သွယ်ပြီး သင့်အတွက် သင့်တော်သော အခန်းကို ရှာဖွေပါ"
              description="Reach out to an AyesayRent consultant for personalized help"
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <article className="rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H5.9v-2.9h3.54V9.85c0-3.5 2.08-5.43 5.27-5.43 1.53 0 3.13.27 3.13.27v3.44h-1.76c-1.73 0-2.27 1.07-2.27 2.18v2.62h3.86l-.62 2.9h-3.24v7c4.78-.75 8.44-4.9 8.44-9.9 0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">
                  Facebook Messenger
                </h3>
                <p className="mt-2 text-sm text-zinc-500">Add Facebook link</p>
              </article>

              <article className="rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.086.766.062 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">LINE</h3>
                <p className="mt-2 text-sm text-zinc-500">Add LINE ID</p>
              </article>

              <article className="rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">
                  <BilingualLabel myanmar="ဖုန်း" english="Phone" />
                </h3>
                <p className="mt-2 text-sm text-zinc-500">Add phone number</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Footer */}
      <footer className="border-t border-zinc-100 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg font-bold text-emerald-600">AyesayRent</p>
          <p className="mt-2 text-sm text-zinc-600">
            Trusted Myanmar rental assistance in Thailand
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            ထailandနိုင်ငံရှိ မြန်မာလူမျိုးများအတွက် ယုံကြည်စိတ်ချရသော
            အခန်းငှားဝန်ဆောင်မှု
          </p>
          <p className="mt-6 text-sm text-zinc-400">
            © {new Date().getFullYear()} AyesayRent. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
