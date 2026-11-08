export const BOLMSO_ROOT_DOMAIN = "bolmso.app";

export function isBolmsoHostname(hostname?: string | null): boolean {
  if (!hostname) return false;
  const clean = hostname.split(":")[0].toLowerCase();
  return clean === BOLMSO_ROOT_DOMAIN || clean.endsWith(`.${BOLMSO_ROOT_DOMAIN}`);
}

export function getBolmsoCookieOptions(hostname?: string | null) {
  const effectiveHost =
    hostname ??
    (typeof window !== "undefined" ? window.location.hostname : undefined);
  const useRootDomain = isBolmsoHostname(effectiveHost);

  return {
    ...(useRootDomain ? { domain: `.${BOLMSO_ROOT_DOMAIN}` } : {}),
    path: "/",
    sameSite: "lax" as const,
    secure: useRootDomain || process.env.NODE_ENV === "production",
  };
}
