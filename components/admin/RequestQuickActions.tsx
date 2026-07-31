import Link from "next/link";
import { CopyTextButton } from "@/components/admin/CopyTextButton";

type RequestQuickActionsProps = {
  phoneNumber: string;
  socialContact: string | null;
  propertyIds: string[];
};

export function RequestQuickActions({
  phoneNumber,
  socialContact,
  propertyIds,
}: RequestQuickActionsProps) {
  const sanitizedPhone = phoneNumber.replace(/[^\d+]/g, "");

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/admin/requests"
        className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
      >
        Back to Requests
      </Link>

      {sanitizedPhone ? (
        <a
          href={`tel:${sanitizedPhone}`}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Call Customer
        </a>
      ) : null}

      <CopyTextButton value={phoneNumber} label="Copy Phone" />

      {socialContact ? (
        <CopyTextButton
          value={socialContact}
          label="Copy Line / Contact"
        />
      ) : null}

      {propertyIds.map((propertyId) => (
        <Link
          key={propertyId}
          href={`/admin/properties/${propertyId}`}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
        >
          Open Property {propertyId}
        </Link>
      ))}
    </div>
  );
}
