"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface MeState {
  email: string | null;
  isAdmin: boolean;
}

export default function AuthButton() {
  const [me, setMe] = useState<MeState | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let active = true;

    async function load() {
      const res = await fetch("/api/me");
      if (!active) return;
      if (res.ok) {
        const data = await res.json();
        setMe({ email: data.user?.email ?? null, isAdmin: data.isAdmin });
      } else {
        setMe({ email: null, isAdmin: false });
      }
    }
    load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setMe({ email: null, isAdmin: false });
    router.push("/");
    router.refresh();
  }

  // Loading placeholder to avoid layout shift.
  if (me === null) {
    return (
      <span className="h-9 w-20 animate-pulse rounded-full bg-surface-container-high" />
    );
  }

  if (!me.email) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-on-primary shadow-1 transition hover:bg-primary/90"
      >
        Sign in
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-2">
      {me.isAdmin && (
        <Link
          href="/admin"
          className="hidden h-9 items-center rounded-full border border-outline-variant px-4 text-sm text-on-surface-variant transition hover:bg-surface-container-high sm:inline-flex"
        >
          Admin
        </Link>
      )}
      <span
        className="hidden max-w-[160px] truncate text-sm text-on-surface-variant md:inline"
        title={me.email}
      >
        {me.email}
      </span>
      <button
        onClick={signOut}
        className="h-9 rounded-full border border-outline-variant px-4 text-sm text-on-surface-variant transition hover:bg-surface-container-high"
      >
        Sign out
      </button>
    </span>
  );
}
