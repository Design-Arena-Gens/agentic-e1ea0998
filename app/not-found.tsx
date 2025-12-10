import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface text-white px-6 text-center">
      <h1 className="text-4xl font-semibold">That stream is offline</h1>
      <p className="max-w-md text-sm text-white/70">
        We couldn&apos;t find the video you&apos;re looking for. It may have
        been unpublished or the link is invalid.
      </p>
      <Link
        href="/"
        className="rounded bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
      >
        Return Home
      </Link>
    </main>
  );
}
