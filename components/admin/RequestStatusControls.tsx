"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateRequestStatusAction } from "@/app/admin/actions";
import {
  REQUEST_STATUSES,
  STATUS_LABELS,
  type AvailabilityRequestStatus,
} from "@/lib/admin/requests";

type RequestStatusControlsProps = {
  requestId: string | number;
  currentStatus: AvailabilityRequestStatus;
};

export function RequestStatusControls({
  requestId,
  currentStatus,
}: RequestStatusControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const updateStatus = (status: AvailabilityRequestStatus) => {
    startTransition(async () => {
      const result = await updateRequestStatusAction(requestId, status);

      if (result.error) {
        setFeedback({ type: "error", message: result.error });
        return;
      }

      setFeedback({
        type: "success",
        message: `Status updated to ${STATUS_LABELS[status].workflow}.`,
      });
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Current Status
        </p>
        <p className="mt-1 text-lg font-semibold text-emerald-900">
          {STATUS_LABELS[currentStatus].workflow}
        </p>
        <p className="mt-1 text-sm text-emerald-700/80">
          {STATUS_LABELS[currentStatus].english}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {REQUEST_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            disabled={isPending || status === currentStatus}
            onClick={() => updateStatus(status)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              status === currentStatus
                ? "bg-emerald-700 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            }`}
          >
            {STATUS_LABELS[status].workflow}
          </button>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-zinc-500">
        Unavailable inquiries use the Cancelled status until a dedicated
        unavailable value exists in the database.
      </p>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-zinc-700">
          Or choose a status
        </span>
        <select
          value={currentStatus}
          disabled={isPending}
          onChange={(event) =>
            updateStatus(event.target.value as AvailabilityRequestStatus)
          }
          className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {REQUEST_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status].workflow}
            </option>
          ))}
        </select>
      </label>

      {feedback ? (
        <div
          role="status"
          className={`rounded-lg px-4 py-3 text-sm font-medium ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}
    </div>
  );
}
