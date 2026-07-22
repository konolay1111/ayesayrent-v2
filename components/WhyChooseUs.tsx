import { SectionHeading } from "./SectionHeading";

export function WhyChooseUs() {
  return (
    <section id="why-us" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          myanmar="AyesayRent ကို ဘာကြောင့် ရွေးချယ်သင့်သလဲ"
          english="Why Choose AyesayRent"
          descriptionMm="ထailandန국တွင် မြန်မာလူမျိုးများအတွက် ယုံကြည်စိတ်ချရသော အခန်းငှားဝန်ဆောင်မှု"
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
  );
}
