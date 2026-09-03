// Admin authorization: which signed-in Supabase users may use /admin.
// Comma-separated emails in ADMIN_EMAILS (e.g. "nsropke@gmail.com").

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}
