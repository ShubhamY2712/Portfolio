import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="mb-3 font-display text-display-sm font-semibold text-ink sm:text-display-md">Page not found</h1>
      <p className="mb-8 max-w-sm text-ink-soft">This page doesn&apos;t exist &mdash; but the portfolio does.</p>
      <Link href="/" className="btn-primary">
        Back to home
      </Link>
    </main>
  );
}
