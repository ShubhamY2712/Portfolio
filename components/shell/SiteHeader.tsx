"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import Monogram from "@/components/shell/Monogram";
import ThemeSwitch from "@/components/shell/ThemeSwitch";
import MoreSheet from "@/components/shell/MoreSheet";
import ReadingProgress from "@/components/shell/ReadingProgress";
import type { ConnectLinks } from "@/components/shell/MoreSheet";
import { NAV, SOON, activeNav } from "@/components/shell/nav";
import type { NavItem, NavKey } from "@/components/shell/nav";
import { SITE_NAME } from "@/lib/site";
import styles from "./SiteHeader.module.css";

const TAGLINE: string = "Think · Decide · Build · Ship";

/**
 * Paper-world header (style frame v14). Desktop: brand, paper tabs, Let's
 * connect pill, Ask + Tour buttons and the sky switch. Below 640px: ⋮ More,
 * centred brand, single-window switch (the dock takes over navigation).
 */
export default function SiteHeader({ links }: { links: ConnectLinks }) {
  const pathname: string = usePathname();
  const active: NavKey | null = activeNav(pathname);
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const moreRef = useRef<HTMLButtonElement>(null);

  function closeSheet(): void {
    setSheetOpen(false);
    moreRef.current?.focus();
  }

  return (
    <>
      <header className={styles.top}>
        <div className={styles.ridge} aria-hidden="true" />
        <img className={styles.corner + " " + styles.cornerL + " d"} src="/art/header/header-left-day.webp" alt="" width={367} height={240} />
        <img className={styles.corner + " " + styles.cornerL + " n"} src="/art/header/header-left-night.webp" alt="" width={359} height={240} />
        <img className={styles.corner + " " + styles.cornerR + " d"} src="/art/header/header-right-day.webp" alt="" width={299} height={240} />
        <img className={styles.corner + " " + styles.cornerR + " n"} src="/art/header/header-right-night.webp" alt="" width={301} height={240} />

        <button
          ref={moreRef}
          type="button"
          className={styles.more}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
        >
          <EllipsisVertical size={22} strokeWidth={2.4} aria-hidden="true" />
        </button>

        <Link className={styles.brand} href="/" aria-label={SITE_NAME + ", home"}>
          <span className={styles.markWrap} aria-hidden="true">
            <span className={styles.mark}>
              <Monogram />
            </span>
          </span>
          <span className={styles.brandText}>
            <b translate="no">{SITE_NAME}</b>
            <span>{TAGLINE}</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.tabs}>
            {NAV.map((item: NavItem) => (
              <li key={item.key}>
                <Link href={item.href} aria-current={item.key === active ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.tools}>
          <Link className={styles.connect} href="/contact">
            Let&apos;s connect <span className={styles.arr} aria-hidden="true">→</span>
          </Link>
          {/* Ask (Phase 6) and Tour (Phase 5) are shown so the header matches the
              approved layout, but stay inert until those features ship. */}
          <button type="button" className={styles.iconBtn} aria-label="Ask Shubham" aria-disabled="true" title={SOON}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2.5c.7 5 2.5 7.5 7.5 9.5-5 2-6.8 4.5-7.5 9.5-.7-5-2.5-7.5-7.5-9.5 5-2 6.8-4.5 7.5-9.5Z" />
            </svg>
          </button>
          <button type="button" className={styles.iconBtn} aria-label="Take the 30-second tour" aria-disabled="true" title={SOON}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
            </svg>
          </button>
          <ThemeSwitch />
        </div>

        {pathname.startsWith("/work/") && <ReadingProgress />}
      </header>

      <MoreSheet open={sheetOpen} onClose={closeSheet} active={active} links={links} />
    </>
  );
}
