import { BilingualLabel } from "./BilingualLabel";

export function SearchSection() {
  return (
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
  );
}
