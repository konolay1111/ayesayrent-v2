import { SectionHeading } from "./SectionHeading";

const policyPoints = [
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
];

export function ViewingPolicy() {
  return (
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
          {policyPoints.map((point, index) => (
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
  );
}
