import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function TopAppBar() {
  return (
    <header className="sticky top-0 z-50 bg-surface shadow-1">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-6 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
            G
          </span>
          <span className="font-display text-lg font-medium tracking-tight text-on-surface">
            Bolmsö Scripts
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-2 text-sm">
          <Link
            href="https://bolmso.app"
            className="hidden rounded-full px-3 py-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface sm:block"
          >
            bolmso.app
          </Link>
          <Link
            href="https://github.com/NikRpk"
            className="hidden rounded-full px-3 py-2 text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface sm:block"
          >
            GitHub
          </Link>
          <AuthButton />
        </nav>
      </div>
    </header>
  );
}
