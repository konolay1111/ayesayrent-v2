"use client";

import { useActionState, useEffect, useState } from "react";
import {
  submitShortlistRequestAction,
  type SubmitShortlistRequestState,
} from "@/app/shortlist/actions";
import { SubmitButton } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/locale-provider";
import { publicInputClass, publicSubtextClass, typeLabelClass } from "@/lib/public-ui";

type ShortlistInquiryFormProps = {
  propertyCodes: string[];
};

const initialState: SubmitShortlistRequestState = {
  error: null,
};

const inputClassName = publicInputClass;

export function ShortlistInquiryForm({
  propertyCodes,
}: ShortlistInquiryFormProps) {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(
    submitShortlistRequestAction,
    initialState,
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  return (
    <form
      action={formAction}
      className="mt-6 space-y-5"
      onChange={() => setDirty(true)}
    >
      <input
        type="hidden"
        name="property_codes"
        value={JSON.stringify(propertyCodes)}
      />

      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="customer_name" className={typeLabelClass}>
            {t("form.name")}
          </label>
          <input
            id="customer_name"
            name="customer_name"
            type="text"
            required
            autoComplete="name"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone_number" className="text-sm font-medium text-foreground">
            {t("form.phone")}
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            required
            autoComplete="tel"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="social_contact" className="text-sm font-medium text-foreground">
            {t("form.social")}
          </label>
          <input
            id="social_contact"
            name="social_contact"
            type="text"
            required
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="preferred_area" className="text-sm font-medium text-foreground">
            {t("form.preferredArea")}
          </label>
          <input
            id="preferred_area"
            name="preferred_area"
            type="text"
            required
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="monthly_budget" className="text-sm font-medium text-foreground">
            {t("form.budget")}
          </label>
          <input
            id="monthly_budget"
            name="monthly_budget"
            type="text"
            inputMode="numeric"
            required
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="move_in_date" className="text-sm font-medium text-foreground">
            {t("form.moveIn")}
          </label>
          <input
            id="move_in_date"
            name="move_in_date"
            type="date"
            required
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contract_length" className="text-sm font-medium text-foreground">
            {t("form.contract")}
          </label>
          <input
            id="contract_length"
            name="contract_length"
            type="text"
            placeholder={t("form.contractPlaceholder")}
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="number_of_occupants"
            className="text-sm font-medium text-foreground"
          >
            {t("form.occupants")}
          </label>
          <input
            id="number_of_occupants"
            name="number_of_occupants"
            type="number"
            min={1}
            required
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="message" className="text-sm font-medium text-foreground">
            {t("form.notes")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`${publicInputClass} py-2.5`}
          />
        </div>
      </div>

      <fieldset className="space-y-4 rounded-xl border border-border bg-muted p-4">
        <legend className="sr-only">Acknowledgements</legend>

        <label className="flex cursor-pointer gap-3">
          <input
            type="checkbox"
            name="availability_acknowledged"
            required
            className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm leading-relaxed text-foreground">
            {t("form.ackAvailability")}
          </span>
        </label>

        <label className="flex cursor-pointer gap-3">
          <input
            type="checkbox"
            name="viewing_policy_acknowledged"
            required
            className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm leading-relaxed text-foreground">
            {t("form.ackViewing")}
          </span>
        </label>
      </fieldset>

      {state.error ? (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.error}
          <span className={`mt-1 block ${publicSubtextClass}`}>
            {t("form.errorFallback")}
          </span>
        </div>
      ) : null}

      <SubmitButton loading={isPending} fullWidth className="sm:w-auto sm:px-10">
        {isPending ? t("form.submitting") : t("form.submit")}
      </SubmitButton>
    </form>
  );
}
