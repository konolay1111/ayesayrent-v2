"use client";

import { useRouter } from "next/navigation";
import { addToShortlist } from "@/lib/shortlist";

type CheckAvailabilityButtonProps = {
  propertyId: string;
  className?: string;
};

const defaultClassName =
  "inline-flex h-11 flex-1 flex-col items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white transition-colors hover:bg-emerald-700";

export function CheckAvailabilityButton({
  propertyId,
  className = defaultClassName,
}: CheckAvailabilityButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addToShortlist(propertyId);
        router.push("/shortlist");
      }}
    >
      <span>ရရှိနိုင်မှု စစ်ဆေးရန်</span>
      <span className="text-xs font-normal text-emerald-100">
        Check Availability
      </span>
    </button>
  );
}
