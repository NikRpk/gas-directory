"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildBolmsoLoginUrl,
  buildBolmsoLogoutUrl,
} from "@/components/bolmso-auth";

function LoginContent() {
  const searchParams = useSearchParams();
  const isNotAdmin = searchParams.get("error") === "not-admin";
  const rawNext = searchParams.get("next")?.startsWith("/")
    ? searchParams.get("next")!
    : "/admin";

  useEffect(() => {
    if (isNotAdmin) return;
    const targetUrl = `${window.location.origin}${rawNext}`;
    window.location.replace(
      buildBolmsoLoginUrl({
        app: "gas",
        nextUrl: targetUrl,
      })
    );
  }, [isNotAdmin, rawNext]);

  if (isNotAdmin) {
    const switchHref =
      typeof window !== "undefined"
        ? buildBolmsoLogoutUrl(
            buildBolmsoLoginUrl({
              app: "gas",
              nextUrl: `${window.location.origin}${rawNext}`,
            })
          )
        : "https://bolmso.app/login?app=gas";

    return (
      <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-medium text-on-surface">
          Admin Access Required
        </h1>
        <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
          This bolmso.app account is not an admin.
        </p>
        <a
          href={switchHref}
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-on-primary shadow-1 transition hover:bg-primary/90"
        >
          Switch bolmso.app account
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-6 py-24 text-center">
      <h1 className="font-display text-2xl font-medium text-on-surface">
        Redirecting to bolmso.app login…
      </h1>
      <p className="text-sm text-on-surface-variant">
        Opening the shared bolmso.app sign-in page.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-sm px-6 py-24 text-center text-sm text-on-surface-variant">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
