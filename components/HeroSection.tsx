export function HeroSection() {
  return (
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
  );
}
