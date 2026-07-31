import { headers } from "next/headers";

function normalizeOrigin(value: string) {
  return value.trim().replace(/\/+$/, "");
}

/**
 * Resolves the public site origin for server-generated absolute URLs.
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL (optional explicit production URL)
 * 2. VERCEL_URL (automatic on Vercel)
 * 3. Incoming request headers (local dev + hosted requests)
 */
export async function resolveSiteOrigin(): Promise<string | null> {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredOrigin) {
    return normalizeOrigin(configuredOrigin);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${normalizeOrigin(vercelUrl)}`;
  }

  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!host) {
    return null;
  }

  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  const isLocal =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local");
  const protocol = forwardedProto ?? (isLocal ? "http" : "https");

  return `${protocol}://${host}`;
}
