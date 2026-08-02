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
  const { data: r040 } = await supabase
    .from("properties")
    .select("*")
    .eq("property_id", "R040")
    .maybeSingle();

  console.log("R040 full property row keys:", Object.keys(r040 ?? {}));
  console.log("R040 area field:", JSON.stringify(r040?.area));
  console.log("R040 all string fields:");
  for (const [key, value] of Object.entries(r040 ?? {})) {
    if (typeof value === "string") console.log(`  ${key}: ${JSON.stringify(value)}`);
  }

  const { data: pathum } = await supabase
    .from("properties")
    .select("property_id, area, transit_name")
    .eq("area", "Pathum Thani");

  console.log("\nPathum Thani properties:");
  for (const p of pathum ?? []) console.log(p);

  const { data: pathumLike } = await supabase
    .from("properties")
    .select("property_id, area")
    .ilike("area", "%Pathum%");

  console.log("\nProperties with area ilike Pathum:");
  for (const p of pathumLike ?? []) console.log(p);
}

main().catch(console.error);
