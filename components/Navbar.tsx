'use client';

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-black/80 to-transparent px-6 py-4 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-brand">
          StreamSphere
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="transition hover:text-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Browse
          </Link>
          <Link
            href="/upload"
            className="rounded bg-brand px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light"
          >
            Upload
          </Link>
        </div>
      </nav>
    </header>
  );
}
