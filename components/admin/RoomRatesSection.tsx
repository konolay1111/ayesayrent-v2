"use client";

import { useState } from "react";
import { RoomRateCard } from "@/components/admin/RoomRateCard";

type RoomRateRecord = Record<string, unknown>;

type RoomRatesSectionProps = {
  propertyId: string;
  roomRates: RoomRateRecord[];
  blankRoomTemplate: RoomRateRecord;
};

export function RoomRatesSection({
  propertyId,
  roomRates,
  blankRoomTemplate,
}: RoomRatesSectionProps) {
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          + Add New Room
        </button>
      </div>

      {showNewForm ? (
        <div className="mb-4">
          <RoomRateCard
            room={blankRoomTemplate}
            roomNumber={roomRates.length + 1}
            propertyId={propertyId}
            isNew
            onCancel={() => setShowNewForm(false)}
          />
        </div>
      ) : null}

      {roomRates.length === 0 && !showNewForm ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
          <p className="text-gray-500">No room rates found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roomRates.map((room, index) => (
            <RoomRateCard
              key={String(room.room_rate_id ?? index)}
              room={room}
              roomNumber={index + 1}
              propertyId={propertyId}
            />
          ))}
        </div>
      )}
    </>
  );
}
