import { IconTrain } from "@/components/icons";
import { company } from "@/lib/config/company";
import { cn } from "@/lib/cn";
import { publicBadgeClass } from "@/lib/public-ui";

type VerifiedListingPlaceholderProps = {
  publicReference: string;
  transitName: string | null;
};

/** Elegant architectural line-art for the listing media area (no photos). */
function ApartmentLineArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Ground line */}
      <path
        d="M4 66h112"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Main tower */}
      <path
        d="M38 66V18h44v48"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* Roofline accent */}
      <path
        d="M34 18h52"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M42 12h36v6H42z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* Balcony ledge */}
      <path
        d="M34 40h52"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      {/* Window grid — upper */}
      <path d="M46 24h8v8h-8z" stroke="currentColor" strokeWidth="1" />
      <path d="M66 24h8v8h-8z" stroke="currentColor" strokeWidth="1" />
      {/* Window grid — mid */}
      <path d="M46 44h8v8h-8z" stroke="currentColor" strokeWidth="1" />
      <path d="M66 44h8v8h-8z" stroke="currentColor" strokeWidth="1" />
      {/* Side wing left */}
      <path
        d="M18 66V36h20"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path d="M24 42h8v7h-8z" stroke="currentColor" strokeWidth="1" opacity="0.75" />
      <path d="M24 54h8v7h-8z" stroke="currentColor" strokeWidth="1" opacity="0.75" />
      {/* Side wing right */}
      <path
        d="M102 66V36H82"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path d="M88 42h8v7h-8z" stroke="currentColor" strokeWidth="1" opacity="0.75" />
      <path d="M88 54h8v7h-8z" stroke="currentColor" strokeWidth="1" opacity="0.75" />
      {/* Entry */}
      <path
        d="M54 66v-10h12v10"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedListingPlaceholder({
  publicReference,
  transitName,
}: VerifiedListingPlaceholderProps) {
  return (
    <div
      className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-secondary via-secondary/80 to-muted sm:h-56"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-primary/5 transition-transform duration-500 ease-out group-hover:scale-105" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/[0.06] to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex flex-col items-center px-4 text-center transition-transform duration-300 ease-out group-hover:scale-[1.02]">
        <ApartmentLineArt className="h-12 w-[5.25rem] text-primary/40 transition-colors duration-300 group-hover:text-primary/55 sm:h-14 sm:w-[6rem]" />

        <p className="mt-2 text-sm font-bold tracking-tight text-primary sm:text-[0.95rem]">
          {company.name}
        </p>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80 sm:text-[11px]">
          Verified Listing
        </p>

        <p className="mt-1.5 font-mono text-xs font-semibold tracking-wide text-primary">
          {publicReference}
        </p>

        <p className="mt-1 max-w-[16rem] text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
          Bangkok Apartment • Verified by {company.name}
        </p>
      </div>

      {transitName ? (
        <span
          className={cn(
            publicBadgeClass,
            "absolute left-4 top-4 max-w-[70%] truncate bg-card/90 text-foreground backdrop-blur-sm",
          )}
        >
          <IconTrain size={14} className="mr-1 inline-block align-text-bottom" />
          {transitName}
        </span>
      ) : null}
    </div>
  );
}
