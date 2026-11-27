"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MascotIcon, NavIcon } from "@/components/shell/NavIcon";
import { NAV, SOON, activeNav } from "@/components/shell/nav";
import type { NavItem, NavKey } from "@/components/shell/nav";
import styles from "./MobileDock.module.css";

/** Frosted bottom dock for phones (<640px): 5 pages + Ask. */
export default function MobileDock() {
  const active: NavKey | null = activeNav(usePathname());

  return (
    <nav className={styles.dock} aria-label="Mobile">
      <ul className={styles.list}>
        {NAV.map((item: NavItem) => (
          <li key={item.key}>
            <Link className={styles.item} href={item.href} aria-current={item.key === active ? "page" : undefined}>
              <span className={styles.icon} aria-hidden="true">
                <NavIcon navKey={item.key} size={26} />
              </span>
              <span className={styles.label}>{item.dockLabel}</span>
            </Link>
          </li>
        ))}
        <li>
          {/* Opens the Ask Shubham drawer once Phase 6 ships; inert until then. */}
          <button type="button" className={styles.item} aria-disabled="true" title={SOON}>
            <span className={styles.icon + " " + styles.mascot} aria-hidden="true">
              <MascotIcon size={26} />
            </span>
            <span className={styles.label}>Ask</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
