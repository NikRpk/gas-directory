import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-medium text-on-surface">404</h1>
      <p className="text-on-surface-variant">
        That script doesn&apos;t exist in the directory.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-on-primary"
      >
        Back to directory
      </Link>
    </div>
  );
}
