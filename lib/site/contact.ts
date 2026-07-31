import {
  company,
  getCompanyFacebook,
  getCompanyLineId,
  getCompanyLineQrPath,
  getCompanyLineUrl,
  getCompanyLogoPath,
  isCompanyFacebookConfigured,
  isCompanyLineConfigured,
} from "@/lib/config/company";

export const AGENCY_CONTACT = {
  lineId: getCompanyLineId() || null,
  lineQrUrl: getCompanyLineQrPath(),
  facebookUrl: getCompanyFacebook() || null,
  logoUrl: getCompanyLogoPath(),
} as const;

export function getAgencyContactHref() {
  if (isCompanyLineConfigured()) {
    return getCompanyLineUrl();
  }

  if (isCompanyFacebookConfigured()) {
    return getCompanyFacebook();
  }

  return "/#contact";
}

export function getAgencyContactLabel() {
  if (isCompanyLineConfigured()) {
    return `Contact ${company.name} on LINE`;
  }

  if (isCompanyFacebookConfigured()) {
    return `Contact ${company.name}`;
  }

  return `Contact ${company.name}`;
}
