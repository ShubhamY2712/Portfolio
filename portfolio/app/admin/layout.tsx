import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "./actions";

type AdminLink = { href: string; label: string };

const LINKS: AdminLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/highlights", label: "Working on" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/achievements", label: "Achievements" },
  { href: "/admin/certifications", label: "Certifications" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="max-w-content mx-auto flex h-14 items-center gap-4 px-4 sm:px-6">
          {/* Scrolls horizontally on small screens instead of overflowing. */}
          <nav aria-label="Admin" className="-mx-1 min-w-0 flex-1 overflow-x-auto">
            <ul className="flex w-max items-center gap-1 px-1 text-sm">
              {LINKS.map((link: AdminLink) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block whitespace-nowrap rounded-md px-2.5 py-1.5 text-ink-soft transition-colors hover:bg-primary-soft hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  target="_blank"
                  className="block whitespace-nowrap rounded-md px-2.5 py-1.5 text-primary hover:bg-primary-soft"
                >
                  View site &rarr;
                </Link>
              </li>
            </ul>
          </nav>
          <form action={logout} className="shrink-0">
            <button type="submit" className="rounded-md px-2.5 py-1.5 text-sm text-ink-soft hover:bg-primary-soft hover:text-ink">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main id="main" className="max-w-content mx-auto px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
