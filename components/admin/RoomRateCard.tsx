"use client";

import {
  createRoomRateAction,
  deleteRoomRateAction,
  updateRoomRateAction,
} from "@/app/admin/room-rate-actions";

const protectedRoomFields = new Set([
  "room_rate_id",
  "property_id",
  "created_at",
  "updated_at",
]);

type RoomRateRecord = Record<string, unknown>;

type RoomRateCardProps = {
  room: RoomRateRecord;
  roomNumber: number;
  propertyId: string;
  isNew?: boolean;
  onCancel?: () => void;
};

export function RoomRateCard({
  room,
  roomNumber,
  propertyId,
  isNew = false,
  onCancel,
}: RoomRateCardProps) {
  const roomTitle = isNew
    ? "New Room Rate"
    : room.room_type && String(room.room_type).trim()
      ? String(room.room_type)
      : `Room ${roomNumber}`;

  return (
    <details
      open
      className="rounded-xl border border-gray-200 bg-gray-50"
    >
      <summary className="flex cursor-pointer list-none flex-col gap-3 border-b border-gray-200 p-5 marker:content-none sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{roomTitle}</h3>
          {!isNew ? (
            <>
              <p className="mt-1 text-sm text-gray-600">
                {formatRentThb(room.monthly_rent_thb)} ·{" "}
                {formatSizeSqm(room.size_sqm)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Room Rate ID: {displayValue(room.room_rate_id)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-gray-600">
              Enter room details, then press Create Room.
            </p>
          )}
        </div>

        {!isNew ? (
          <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
            {displayValue(room.record_status)}
          </span>
        ) : null}
      </summary>

      <div className="p-5">
        <form action={isNew ? createRoomRateAction : updateRoomRateAction}>
          <input type="hidden" name="property_id" value={propertyId} />
          {!isNew ? (
            <input
              type="hidden"
              name="room_rate_id"
              value={String(room.room_rate_id ?? "")}
            />
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {Object.entries(room).map(([key, value]) => (
              <RoomRateField
                key={key}
                roomRateId={String(room.room_rate_id ?? roomNumber)}
                fieldName={key}
                value={value}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {isNew && onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            ) : null}
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800"
            >
              {isNew ? "Create Room" : "Save Room"}
            </button>
          </div>
        </form>

        {!isNew ? (
          <form action={deleteRoomRateAction} className="mt-3 flex justify-end">
            <input type="hidden" name="property_id" value={propertyId} />
            <input
              type="hidden"
              name="room_rate_id"
              value={String(room.room_rate_id ?? "")}
            />

            <button
              type="submit"
              className="rounded-lg border border-red-300 bg-white px-5 py-2.5 font-semibold text-red-700 hover:bg-red-50"
            >
              Delete Room
            </button>
          </form>
        ) : null}
      </div>
    </details>
  );
}

function RoomRateField({
  roomRateId,
  fieldName,
  value,
}: {
  roomRateId: string;
  fieldName: string;
  value: unknown;
}) {
  const isProtected = protectedRoomFields.has(fieldName);
  const isBoolean = typeof value === "boolean";
  const isNumber = typeof value === "number";

  const isLongText =
    fieldName.includes("details") ||
    fieldName.includes("options") ||
    fieldName.includes("policy") ||
    fieldName.includes("note");

  const inputId = `room-${roomRateId}-${fieldName}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {formatLabel(fieldName)}
      </label>

      {isBoolean ? (
        <select
          id={inputId}
          name={fieldName}
          defaultValue={value ? "true" : "false"}
          disabled={isProtected}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      ) : isLongText ? (
        <textarea
          id={inputId}
          name={fieldName}
          defaultValue={inputValue(value)}
          disabled={isProtected}
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 disabled:bg-gray-100 disabled:text-gray-500"
        />
      ) : (
        <input
          id={inputId}
          name={fieldName}
          type={isNumber ? "number" : "text"}
          step={isNumber ? "any" : undefined}
          defaultValue={inputValue(value)}
          disabled={isProtected}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 disabled:bg-gray-100 disabled:text-gray-500"
        />
      )}

      {isProtected ? (
        <p className="mt-1 text-xs text-gray-500">
          This system field cannot be changed.
        </p>
      ) : null}
    </div>
  );
}

function formatRentThb(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Rent -";
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return `Rent ${String(value)}`;
  }

  return `฿${numericValue.toLocaleString()} / month`;
}

function formatSizeSqm(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "Size -";
  }

  return `${String(value)} sqm`;
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function inputValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
