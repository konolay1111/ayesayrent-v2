import { createHash, randomBytes } from "crypto";

const TOKEN_BYTE_LENGTH = 32;

export function generateShareToken() {
  return randomBytes(TOKEN_BYTE_LENGTH)
    .toString("base64url")
    .replace(/=/g, "");
}

export function hashShareToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function buildSharePath(token: string) {
  return `/share/photos/${encodeURIComponent(token)}`;
}
