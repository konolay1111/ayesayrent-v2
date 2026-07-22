"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { BilingualLabel } from "@/components/BilingualLabel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  SHORTLIST_CHANGE_EVENT,
  readShortlist,
  removeFromShortlist,
} from "@/lib/shortlist";
import { getSampleProperty } from "@/lib/sample-properties";

type FormData = {
  customerName: string;
  phone: string;
  contact: string;
  preferredArea: string;
  budget: string;
  moveInDate: string;
  occupants: string;
  notes: string;
  availabilityAck: boolean;
  viewingPolicyAck: boolean;
};

const initialFormData: FormData = {
  customerName: "",
  phone: "",
  contact: "",
  preferredArea: "",
  budget: "",
  moveInDate: "",
  occupants: "",
  notes: "",
  availabilityAck: false,
  viewingPolicyAck: false,
};

export default function ShortlistPage() {
  const [codes, setCodes] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submittedCodes, setSubmittedCodes] = useState<string[] | null>(null);

  const syncShortlist = useCallback(() => {
    setCodes(readShortlist());
  }, []);

  useEffect(() => {
    syncShortlist();

    const handleChange = () => syncShortlist();
    window.addEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(SHORTLIST_CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, [syncShortlist]);

  const handleRemove = (code: string) => {
    removeFromShortlist(code);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      codes.length === 0 ||
      !formData.availabilityAck ||
      !formData.viewingPolicyAck
    ) {
      return;
    }

    setSubmittedCodes([...codes]);
  };

  const inputClassName =
    "h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-zinc-800">
      <Header />

      <main className="flex-1">
        <section className="border-b border-zinc-100 bg-gradient-to-b from-emerald-50/60 to-white px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              ရွေးချယ်ထားသော အခန်းများ
            </h1>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              Your Shortlist
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Select the apartments you want AyesayRent to check with the
              property owners.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              AyesayRent will contact each owner and confirm availability before
              sharing full details.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {submittedCodes ? (
            <section
              aria-live="polite"
              className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold text-emerald-900">
                တောင်းဆိုမှု အောင်မြင်ပါသည်
              </h2>
              <p className="mt-1 text-sm font-medium text-emerald-700">
                Availability check request received
              </p>
              <p className="mt-4 text-sm leading-relaxed text-emerald-800">
                AyesayRent will contact the property owners and confirm
                availability for the following property codes:
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {submittedCodes.map((code) => (
                  <li
                    key={code}
                    className="rounded-lg bg-white px-3 py-1.5 font-mono text-sm font-semibold text-emerald-700 shadow-sm"
                  >
                    {code}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-emerald-700/80">
                Your shortlist has been kept. We will contact you after
                confirming with each property owner.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex h-11 flex-col items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <span>အခန်းများ ဆက်ရှာရန်</span>
                <span className="text-xs font-normal text-emerald-100">
                  Continue Searching
                </span>
              </Link>
            </section>
          ) : codes.length === 0 ? (
            <section className="rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-16 text-center">
              <p className="text-lg font-semibold text-zinc-900">
                ရွေးချယ်ထားသော အခန်း မရှိသေးပါ
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                No properties selected yet.
              </p>
              <Link
                href="/search"
                className="mt-6 inline-flex h-11 flex-col items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <span>အခန်းရှာရန်</span>
                <span className="text-xs font-normal text-emerald-100">
                  Search Apartments
                </span>
              </Link>
            </section>
          ) : (
            <div className="grid gap-8 lg:grid-cols-5">
              <section
                aria-labelledby="shortlist-items-heading"
                className="space-y-4 lg:col-span-2"
              >
                <h2
                  id="shortlist-items-heading"
                  className="text-lg font-semibold text-zinc-900"
                >
                  <BilingualLabel
                    myanmar="ရွေးချယ်ထားသော အခန်းများ"
                    english="Selected Properties"
                  />
                </h2>

                <ul className="space-y-4">
                  {codes.map((code) => {
                    const property = getSampleProperty(code);

                    return (
                      <li key={code}>
                        <article className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                          <p className="font-mono text-sm font-semibold text-emerald-700">
                            {code}
                          </p>

                          {property ? (
                            <dl className="mt-4 space-y-2 text-sm">
                              <div className="flex justify-between gap-2">
                                <dt className="text-zinc-500">
                                  <BilingualLabel
                                    myanmar="လစဉ်ငှားရမ်းခ"
                                    english="Monthly Rent"
                                  />
                                </dt>
                                <dd className="font-medium text-zinc-800">
                                  {property.rent}
                                </dd>
                              </div>
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
                            </dl>
                          ) : (
                            <p className="mt-3 text-sm text-zinc-500">
                              Public listing details will be confirmed by
                              AyesayRent.
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemove(code)}
                            className="mt-4 inline-flex h-10 w-full flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-100"
                          >
                            <span>ဖယ်ရှားရန်</span>
                            <span className="text-xs font-normal text-red-600/80">
                              Remove
                            </span>
                          </button>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section
                aria-labelledby="request-form-heading"
                className="lg:col-span-3"
              >
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8">
                  <h2
                    id="request-form-heading"
                    className="text-lg font-semibold text-zinc-900"
                  >
                    <BilingualLabel
                      myanmar="အခန်းလွတ် စစ်ဆေးရန် တောင်းဆိုမှု"
                      english="Availability Request"
                    />
                  </h2>

                  <div className="mt-4 rounded-xl bg-emerald-50/80 px-4 py-3">
                    <p className="text-sm font-medium text-emerald-900">
                      Selected property codes
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {codes.map((code) => (
                        <li
                          key={code}
                          className="rounded-lg bg-white px-2.5 py-1 font-mono text-xs font-semibold text-emerald-700"
                        >
                          {code}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label
                          htmlFor="customer-name"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="အမည်"
                            english="Customer Name"
                          />
                        </label>
                        <input
                          id="customer-name"
                          name="customerName"
                          type="text"
                          required
                          className={inputClassName}
                          value={formData.customerName}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              customerName: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="ဖုန်းနံပါတ်"
                            english="Phone Number"
                          />
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className={inputClassName}
                          value={formData.phone}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="contact"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="Facebook သို့မဟုတ် LINE"
                            english="Facebook or LINE Contact"
                          />
                        </label>
                        <input
                          id="contact"
                          name="contact"
                          type="text"
                          required
                          className={inputClassName}
                          value={formData.contact}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              contact: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="preferred-area"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="နှစ်သက်သော ဧရိယာ"
                            english="Preferred Area"
                          />
                        </label>
                        <input
                          id="preferred-area"
                          name="preferredArea"
                          type="text"
                          required
                          className={inputClassName}
                          value={formData.preferredArea}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              preferredArea: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="budget"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="လစဉ်ဘတ်ဂျက်"
                            english="Monthly Budget"
                          />
                        </label>
                        <input
                          id="budget"
                          name="budget"
                          type="text"
                          required
                          className={inputClassName}
                          value={formData.budget}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              budget: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="move-in-date"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="နေထိုင်မည့်ရက်"
                            english="Move-in Date"
                          />
                        </label>
                        <input
                          id="move-in-date"
                          name="moveInDate"
                          type="date"
                          required
                          className={inputClassName}
                          value={formData.moveInDate}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              moveInDate: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="occupants"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="နေထိုင်မည့်သူ အရေအတွက်"
                            english="Number of Occupants"
                          />
                        </label>
                        <input
                          id="occupants"
                          name="occupants"
                          type="number"
                          min={1}
                          required
                          className={inputClassName}
                          value={formData.occupants}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              occupants: event.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label
                          htmlFor="notes"
                          className="text-sm font-medium text-zinc-700"
                        >
                          <BilingualLabel
                            myanmar="ထပ်ဆောင်း မှတ်ချက်များ"
                            english="Additional Notes"
                          />
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={4}
                          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          value={formData.notes}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              notes: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <fieldset className="space-y-4 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
                      <legend className="sr-only">Acknowledgements</legend>

                      <label className="flex cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          required
                          checked={formData.availabilityAck}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              availabilityAck: event.target.checked,
                            }))
                          }
                          className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm leading-relaxed text-zinc-700">
                          ရွေးချယ်ထားသော အခန်းများ၏ လက်ရှိအခြေအနေကို
                          AyesayRent မှ ပိုင်ရှင်နှင့် အတည်ပြုရမည်ကို
                          နားလည်ပါသည်။
                          <span className="mt-1 block text-xs text-zinc-500">
                            I understand that AyesayRent must confirm current
                            availability with each property owner.
                          </span>
                        </span>
                      </label>

                      <label className="flex cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          required
                          checked={formData.viewingPolicyAck}
                          onChange={(event) =>
                            setFormData((current) => ({
                              ...current,
                              viewingPolicyAck: event.target.checked,
                            }))
                          }
                          className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm leading-relaxed text-zinc-700">
                          အခန်းကြည့်ရှုရန် ရက်ချိန်းအတည်ပြုပြီးနောက်
                          အခန်းကို ကြည့်ရှုပြီး ကိုယ်ပိုင်အကြောင်းပြချက်ဖြင့်
                          မငှားပါက သဘောတူထားသော ကြည့်ရှုဝန်ဆောင်ခ
                          ပေးဆောင်ရမည်ကို နားလည်ပါသည်။
                          <span className="mt-1 block text-xs text-zinc-500">
                            I understand that after attending a confirmed
                            viewing, the agreed viewing service fee applies if I
                            decide not to rent for personal reasons.
                          </span>
                        </span>
                      </label>
                    </fieldset>

                    <button
                      type="submit"
                      className="inline-flex h-12 w-full flex-col items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto sm:px-8"
                    >
                      <span>အခန်းလွတ် စစ်ဆေးရန် တောင်းဆိုမည်</span>
                      <span className="text-xs font-normal text-emerald-100">
                        Request Availability Check
                      </span>
                    </button>
                  </form>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
