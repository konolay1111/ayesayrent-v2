import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseRentFilterValue(value) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeMonthlyRentThb(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed.replace(/^[\s฿$]+/, "").replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

const INACTIVE = new Set(["inactive", "archived", "deleted", "draft"]);

function isUsableRoomRate(roomRate) {
  const rent = normalizeMonthlyRentThb(roomRate.monthly_rent_thb);
  if (rent === null || rent <= 0) return false;
  if (!roomRate.record_status) return true;
  return !INACTIVE.has(roomRate.record_status.trim().toLowerCase());
}

function roomRateMatchesRent(roomRate, filters) {
  const rent = normalizeMonthlyRentThb(roomRate.monthly_rent_thb);
  if (rent === null) return false;
  if (filters.minRent !== null && rent < filters.minRent) return false;
  if (filters.maxRent !== null && rent > filters.maxRent) return false;
  return true;
}

async function searchPathumThani(supabase, minRentRaw, maxRentRaw) {
  const filters = {
    area: "Pathum Thani",
    minRent: parseRentFilterValue(minRentRaw),
    maxRent: parseRentFilterValue(maxRentRaw),
  };

  const { data: properties } = await supabase
    .from("properties")
    .select("property_id, area, transit_name")
    .eq("area", filters.area);

  const propertyIds = (properties ?? []).map((p) => p.property_id);

  let query = supabase
    .from("room_rates")
    .select(
      "room_rate_id, property_id, monthly_rent_thb, room_type, record_status",
    )
    .in("property_id", propertyIds);

  if (filters.minRent !== null) query = query.gte("monthly_rent_thb", filters.minRent);
  if (filters.maxRent !== null) query = query.lte("monthly_rent_thb", filters.maxRent);

  const { data: roomRates } = await query;
  const matching = (roomRates ?? [])
    .map((row) => ({ ...row, monthly_rent_thb: normalizeMonthlyRentThb(row.monthly_rent_thb) }))
    .filter(isUsableRoomRate)
    .filter((row) => roomRateMatchesRent(row, filters));

  return {
    filters,
    total: matching.length,
    rents: matching.map((r) => r.monthly_rent_thb).sort((a, b) => a - b),
    has8200: matching.some((r) => r.monthly_rent_thb === 8200),
    target8200: matching.find((r) => r.monthly_rent_thb === 8200) ?? null,
    minRent: matching.length ? matching[0].monthly_rent_thb : null,
    maxRent: matching.length ? matching.at(-1).monthly_rent_thb : null,
  };
}

loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const tests = [
  { id: "A", minRent: "2500", maxRent: "", expect8200: true, minAtLeast: 2500, maxAtMost: null },
  { id: "B", minRent: "8000", maxRent: "", expect8200: true, minAtLeast: 8000, maxAtMost: null },
  { id: "C", minRent: "2500", maxRent: "8500", expect8200: true, minAtLeast: 2500, maxAtMost: 8500 },
  { id: "D", minRent: "", maxRent: "8500", expect8200: true, minAtLeast: null, maxAtMost: 8500 },
  { id: "E", minRent: "", maxRent: "", expect8200: true, minAtLeast: null, maxAtMost: null },
];

async function main() {
  console.log("=== Target room (Pathum Thani @ 8,200 THB) ===");
  const { data: targetRate } = await supabase
    .from("room_rates")
    .select("room_rate_id, property_id, monthly_rent_thb, room_type, record_status")
    .eq("property_id", "R040")
    .eq("monthly_rent_thb", 8200)
    .maybeSingle();

  const { data: targetProperty } = await supabase
    .from("properties")
    .select("property_id, area")
    .eq("property_id", "R040")
    .maybeSingle();

  console.log({
    property_id: targetRate?.property_id ?? null,
    room_rate_id: targetRate?.room_rate_id ?? null,
    monthly_rent_thb: targetRate?.monthly_rent_thb ?? null,
    monthly_rent_type: typeof targetRate?.monthly_rent_thb,
    property_area: targetProperty?.area ?? null,
    record_status: targetRate?.record_status ?? null,
  });

  console.log("\n=== Rent filter tests (Pathum Thani) ===");
  const results = [];

  for (const test of tests) {
    const outcome = await searchPathumThani(supabase, test.minRent, test.maxRent);
    const pass8200 = outcome.has8200 === test.expect8200;
    const passMin =
      test.minAtLeast === null ||
      (outcome.rents.length > 0 && outcome.rents.every((rent) => rent >= test.minAtLeast));
    const passMax =
      test.maxAtMost === null ||
      (outcome.rents.length > 0 && outcome.rents.every((rent) => rent <= test.maxAtMost));
    const pass = pass8200 && passMin && passMax;

    results.push({
      test: test.id,
      filters: outcome.filters,
      total: outcome.total,
      has8200: outcome.has8200,
      minRent: outcome.minRent,
      maxRent: outcome.maxRent,
      pass,
    });

    console.log(
      `Test ${test.id}: ${pass ? "PASS" : "FAIL"} | total=${outcome.total} has8200=${outcome.has8200} range=${outcome.minRent}-${outcome.maxRent}`,
    );
  }

  const allPass = results.every((result) => result.pass);
  console.log(`\nOverall: ${allPass ? "ALL PASS" : "FAILURES DETECTED"}`);
  process.exit(allPass ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
