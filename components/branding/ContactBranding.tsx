import { FacebookLink } from "@/components/branding/FacebookLink";
import { LineLink } from "@/components/branding/LineLink";
import { LineQrCode } from "@/components/branding/LineQrCode";

type ContactBrandingProps = {
  facebookLabel: string;
  lineLabel: string;
  lineQrLabel: string;
  lineQrAlt: string;
  contactHeading?: string;
  facebookMissingHint?: string;
  lineMissingHint?: string;
  qrMissingHint?: string;
  layout?: "row" | "stack";
  showQr?: boolean;
  facebookVariant?: "link" | "button";
};

export function ContactBranding({
  facebookLabel,
  lineLabel,
  lineQrLabel,
  lineQrAlt,
  contactHeading,
  facebookMissingHint,
  lineMissingHint,
  qrMissingHint,
  layout = "stack",
  showQr = true,
  facebookVariant = "link",
}: ContactBrandingProps) {
  return (
    <div
      className={
        layout === "row"
          ? "flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
          : "flex flex-col items-center gap-6"
      }
    >
      {contactHeading ? (
        <h2 className="text-center text-lg font-semibold text-foreground">
          {contactHeading}
        </h2>
      ) : null}

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8">
        <FacebookLink
          label={facebookLabel}
          missingHint={facebookMissingHint}
          variant={facebookVariant}
        />
        <LineLink label={lineLabel} missingHint={lineMissingHint} />
      </div>

      {showQr ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {lineQrLabel}
          </p>
          <LineQrCode alt={lineQrAlt} missingHint={qrMissingHint} />
        </div>
      ) : null}
    </div>
  );
}
