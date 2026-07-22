export type SampleProperty = {
  code: string;
  rent: string;
  area: string;
  areaMm: string;
  transit: string;
  roomType: string;
  roomTypeMm: string;
};

export const sampleProperties: Record<string, SampleProperty> = {
  "AYR-LAD-001": {
    code: "AYR-LAD-001",
    rent: "฿8,500",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
  },
  "AYR-LAD-015": {
    code: "AYR-LAD-015",
    rent: "฿9,200",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
  },
  "AYR-LAD-028": {
    code: "AYR-LAD-028",
    rent: "฿9,800",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    roomType: "1 Bedroom",
    roomTypeMm: "တစ်ခန်းမ-bedroom",
  },
  "AYR-LAD-041": {
    code: "AYR-LAD-041",
    rent: "฿7,500",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    roomType: "Studio",
    roomTypeMm: "စတူဒီယို",
  },
  "AYR-LAD-052": {
    code: "AYR-LAD-052",
    rent: "฿10,000",
    area: "Lat Phrao",
    areaMm: "လတ်ပါး",
    transit: "MRT Lat Phrao",
    roomType: "1 Bedroom",
    roomTypeMm: "တစ်ခန်းမ-bedroom",
  },
};

export function getSampleProperty(code: string): SampleProperty | undefined {
  return sampleProperties[code];
}
