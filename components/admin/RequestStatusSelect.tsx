"use client";

import { useTransition } from "react";
import { updateRequestStatusAction } from "@/app/admin/actions";
import {
  REQUEST_STATUSES,
  STATUS_LABELS,
  type AvailabilityRequestStatus,
} from "@/lib/admin/requests";

type RequestStatusSelectProps = {
  requestId: string;
  currentStatus: AvailabilityRequestStatus;
};

export function RequestStatusSelect({
  requestId,
  currentStatus,
}: RequestStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value as AvailabilityRequestStatus;

    startTransition(async () => {
      await updateRequestStatusAction(requestId, nextStatus);
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      aria-label="Update request status"
      className="h-10 w-full min-w-[12rem] rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {REQUEST_STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status].myanmar} / {STATUS_LABELS[status].english}
        </option>
      ))}
    </select>
  );
}
