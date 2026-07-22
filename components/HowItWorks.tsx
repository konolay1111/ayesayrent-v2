import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    step: "1",
    titleMm: "အခန်းရှာပါ",
    titleEn: "Search apartments",
    descMm:
      "ဧရိယာ၊ BTS/MRT၊ ငှားရမ်းခနှင့် အခန်းအမျိုးအစားဖြင့် သင့်လိုအပ်ချက်နှင့် ကိုက်ညီသော အခန်းများကို ရှာပါ။",
    descEn: "Filter by area, BTS/MRT station, budget, and room type.",
  },
  {
    step: "2",
    titleMm: "ပိုင်ဆိုင်မှု ကုဒ်ရွေးပါ",
    titleEn: "Select property codes",
    descMm:
      "သင့်စိတ်ဝင်စားသော အခန်းများ၏ ပိုင်ဆိုင်မှု ကုဒ်များကို ရွေးချယ်ပါ။",
    descEn: "Choose the property codes of apartments that interest you.",
  },
  {
    step: "3",
    titleMm: "ရရှိနိုင်မှု အတည်ပြုပါ",
    titleEn: "Confirm availability",
    descMm:
      "AyesayRent သည် ပိုင်ဆိုင်ရှင်နှင့် ဆက်သွယ်၍ ရရှိနိုင်မှုကို အတည်ပြုပေးပါသည်။",
    descEn: "AyesayRent confirms availability with the property owner.",
  },
  {
    step: "4",
    titleMm: "ကြည့်ရှုရန် စီစဉ်ပါ",
    titleEn: "Arrange a viewing",
    descMm:
      "ရရှိနိုင်မှု အတည်ပြုပြီးနောက် ကြည့်ရှုရန် ရက်ချိန်ကို စီစဉ်ပေးပါသည်။",
    descEn: "Once confirmed, we arrange a convenient viewing appointment.",
  },
];

export function HowItWorks() {
  return (
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
          {steps.map((item) => (
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
  );
}
