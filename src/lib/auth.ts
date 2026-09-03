// Password-based admin auth.
//
// The password lives in the ADMIN_PASSWORD env var. A successful login sets an
// httpOnly cookie whose value is HMAC-SHA256(session-payload, ADMIN_PASSWORD),
// so the cookie can't be forged without knowing the password.

export const ADMIN_COOKIE = "gas_admin";

const SESSION_PAYLOAD = "gas-admin-session-v1";

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(input: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(input)
  );
  return toHex(sig);
}

export async function createAdminToken(): Promise<string> {
  return hmac(SESSION_PAYLOAD, adminPassword());
}

export async function verifyAdminToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const expected = await createAdminToken();
  if (token.length !== expected.length) return false;
  // constant-time comparison
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function checkPassword(candidate: string): boolean {
  return candidate === adminPassword();
}

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD env var is not set");
  return pw;
}
