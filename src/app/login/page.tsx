"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") ? next : "/admin");
      router.refresh();
    } else {
      setError("Wrong password. Try again.");
      setPassword("");
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-24">
      <div className="text-center">
        <h1 className="font-display text-3xl font-medium text-on-surface">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Enter the admin password to manage the directory.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl bg-surface-container p-6 shadow-1"
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="h-12 rounded-xl border border-outline-variant bg-surface px-4 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="h-12 rounded-full bg-primary text-sm font-medium text-on-primary shadow-1 transition hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
