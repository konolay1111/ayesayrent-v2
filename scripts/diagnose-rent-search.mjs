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

loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function main() {
  const { data: roomRates } = await supabase
    .from("room_rates")
    .select(
      "room_rate_id, property_id, monthly_rent_thb, room_type, record_status",
    )
    .eq("monthly_rent_thb", 8200);

  console.log("=== Room rates with monthly_rent_thb = 8200 ===");
  for (const rate of roomRates ?? []) {
    const { data: property } = await supabase
      .from("properties")
      .select("property_id, area, transit_name, record_status")
      .eq("property_id", rate.property_id)
      .maybeSingle();

    console.log({
      property_id: rate.property_id,
      room_rate_id: rate.room_rate_id,
      monthly_rent_thb: rate.monthly_rent_thb,
      monthly_rent_type: typeof rate.monthly_rent_thb,
      room_type: rate.room_type,
      room_record_status: rate.record_status,
      property_area: property?.area ?? null,
      property_transit: property?.transit_name ?? null,
      property_record_status: property?.record_status ?? null,
    });
  }

  const { data: pathumProperties } = await supabase
    .from("properties")
    .select("property_id")
    .eq("area", "Pathum Thani");

  const propertyIds = (pathumProperties ?? []).map((p) => p.property_id);
  console.log("\nPathum Thani property count:", propertyIds.length);

  const { data: pathumRates, count } = await supabase
    .from("room_rates")
    .select("room_rate_id, property_id, monthly_rent_thb", { count: "exact" })
    .in("property_id", propertyIds);

  console.log("Pathum Thani room_rates returned:", pathumRates?.length ?? 0);
  console.log("Pathum Thani room_rates total count:", count);

  const has8200 = (pathumRates ?? []).some((r) => r.monthly_rent_thb === 8200);
  console.log("8200 rate in default fetch:", has8200);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
