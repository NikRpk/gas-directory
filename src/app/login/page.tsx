"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const urlError =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("error")
      : null;

  function redirectTarget(): string {
    const next = new URLSearchParams(window.location.search).get("next");
    return next?.startsWith("/") ? next : "/admin";
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push(redirectTarget());
      router.refresh();
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTarget())}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success the browser navigates away to Google.
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-24">
      <div className="text-center">
        <h1 className="font-display text-3xl font-medium text-on-surface">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Use your bolmso.app account. Only admins can manage the directory.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-surface-container p-6 shadow-1">
        {(error || urlError) && (
          <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error ||
              (urlError === "not-admin"
                ? "This account is not an admin."
                : "Sign-in failed. Please try again.")}
          </p>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex h-12 items-center justify-center gap-3 rounded-full border border-outline-variant bg-surface text-sm font-medium text-on-surface transition hover:bg-surface-container-high disabled:opacity-50"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-outline-variant" />
          <span className="text-xs uppercase text-on-surface-variant">or</span>
          <div className="h-px flex-1 bg-outline-variant" />
        </div>

        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-12 rounded-xl border border-outline-variant bg-surface px-4 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-12 rounded-xl border border-outline-variant bg-surface px-4 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-full bg-primary text-sm font-medium text-on-primary shadow-1 transition hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l3.98-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}
