/**
 * Central AyesayRent company configuration.
 * Fill in facebook and lineId before launch — do not duplicate elsewhere.
 */
export const company = {
  name: "AyesayRent",
  facebook: "https://www.facebook.com/share/1H21SLabAe/",
  lineId: "+660992600692",
  logo: "/20914.jpg",
  lineQr: "/20913.jpg",
};

/** @deprecated Prefer `company`. */
export const companyConfig = company;

export function getCompanyFacebook() {
  return company.facebook.trim();
}

export function getCompanyLineId() {
  return company.lineId.trim();
}

export function getCompanyLogoPath() {
  return company.logo;
}

export function getCompanyLineQrPath() {
  return company.lineQr;
}

export function getCompanyLineUrl() {
  const lineId = getCompanyLineId();

  if (lineId) {
    return `https://line.me/ti/p/~${encodeURIComponent(lineId)}`;
  }

  return "";
}

export function isCompanyFacebookConfigured() {
  return getCompanyFacebook().length > 0;
}

export function isCompanyLineConfigured() {
  return getCompanyLineId().length > 0;
}

export type MissingBrandingValue = "facebook" | "lineId" | "logoAsset" | "lineQrAsset";

export function getMissingBrandingValues(): MissingBrandingValue[] {
  const missing: MissingBrandingValue[] = [];

  if (!isCompanyFacebookConfigured()) {
    missing.push("facebook");
  }

  if (!isCompanyLineConfigured()) {
    missing.push("lineId");
  }

  return missing;
}
