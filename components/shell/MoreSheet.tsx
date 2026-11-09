"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode, SyntheticEvent } from "react";
import { ChevronRight, ExternalLink, X } from "lucide-react";
import { GitHubGlyph, LinkedInGlyph, ResumeGlyph } from "@/components/shell/BrandGlyphs";
import Monogram from "@/components/shell/Monogram";
import { MascotIcon, NavIcon } from "@/components/shell/NavIcon";
import { NAV, SHEET_COPY, SOON } from "@/components/shell/nav";
import type { NavItem, NavKey } from "@/components/shell/nav";
import { SITE_NAME } from "@/lib/site";
import styles from "./MoreSheet.module.css";

export type ConnectLinks = {
  linkedin: string | null;
  github: string | null;
  resumeUrl: string | null;
};

const CLOSE_MS: number = 240;

/**
 * ⋮ More sheet for phones: slides in from the left over a dimmed backdrop.
 * A native <dialog> (showModal) gives the focus trap, Esc and an inert page.
 */
export default function MoreSheet({
  open,
  onClose,
  active,
  links,
}: {
  open: boolean;
  onClose: () => void;
  active: NavKey | null;
  links: ConnectLinks;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState<boolean>(false);

  useEffect(() => {
    const dialog: HTMLDialogElement | null = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setClosing(false);
      dialog.showModal();
      document.documentElement.classList.add(styles.locked);
    }
  }, [open]);

  function close(): void {
    const dialog: HTMLDialogElement | null = ref.current;
    if (!dialog || !dialog.open) return;
    const finish = (): void => {
      dialog.close();
      setClosing(false);
      document.documentElement.classList.remove(styles.locked);
      onClose();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    setClosing(true);
    window.setTimeout(finish, CLOSE_MS);
  }

  function onCancel(e: SyntheticEvent<HTMLDialogElement>): void {
    e.preventDefault(); // Esc: run the slide-out instead of an instant close
    close();
  }

  function onBackdropClick(e: MouseEvent<HTMLDialogElement>): void {
    if (e.target === e.currentTarget) close();
  }

  const external: { href: string; label: string; icon: ReactNode }[] = [];
  // 34px brand tiles with white 22px glyphs, as measured on the reference
  if (links.linkedin) external.push({ href: links.linkedin, label: "LinkedIn", icon: <BrandTile bg="#0A66C2"><LinkedInGlyph size={22} /></BrandTile> });
  if (links.github) external.push({ href: links.github, label: "GitHub", icon: <BrandTile bg="#24292F"><GitHubGlyph size={22} /></BrandTile> });
  if (links.resumeUrl) external.push({ href: links.resumeUrl, label: "Resume", icon: <BrandTile bg="rgb(var(--c-rust))"><ResumeGlyph size={22} /></BrandTile> });

  return (
    <dialog
      ref={ref}
      className={styles.dialog + (closing ? " " + styles.closing : "")}
      aria-labelledby="more-title"
      onCancel={onCancel}
      onClick={onBackdropClick}
      data-lenis-prevent
    >
      <div className={styles.sheet}>
        <div className={styles.head}>
          <span className={styles.brand}>
            <span className={styles.tile} aria-hidden="true">
              <Monogram />
            </span>
            <span className={styles.wordmark} translate="no">{SITE_NAME}</span>
          </span>
          <button type="button" className={styles.closeBtn} aria-label="Close menu" onClick={close}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.scroll}>
          <div className={styles.titlebar}>
            <p id="more-title" className={styles.title}>
              {SHEET_COPY.title}
              <svg className={styles.underline} viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2,6 C30,2 70,8 118,4" />
              </svg>
            </p>
            <span className={styles.deco} aria-hidden="true">
              <img className="d" src="/art/sheet/sheet-sun-day.webp" alt="" width={286} height={282} decoding="async" draggable={false} />
              <img className="n" src="/art/sheet/sheet-moon-night.webp" alt="" width={287} height={282} decoding="async" draggable={false} />
            </span>
          </div>

          <section className={styles.group} aria-labelledby="more-explore">
            <p id="more-explore" className={styles.label}>{SHEET_COPY.explore}</p>
            <ul className={styles.list}>
              {NAV.flatMap((item: NavItem) => {
                const row: ReactNode = (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className={styles.row}
                      aria-current={item.key === active ? "page" : undefined}
                      onClick={close}
                    >
                      <span className={styles.icon}><NavIcon navKey={item.key} size={40} /></span>
                      <span className={styles.text}><span className={styles.name}>{item.label}</span></span>
                      <ChevronRight className={styles.end} size={18} aria-hidden="true" />
                    </Link>
                  </li>
                );
                // Ask Shubham sits right after Portfolio, as on the reference.
                if (item.key !== "portfolio") return [row];
                return [
                  row,
                  <li key="ask">
                    <SoonRow icon={<MascotIcon size={40} />} name={SHEET_COPY.askLabel} sub={SHEET_COPY.askSub} />
                  </li>,
                ];
              })}
              <li>
                <SoonRow icon={<NavIcon navKey="home" size={40} />} name={SHEET_COPY.tourLabel} sub={SHEET_COPY.tourSub} />
              </li>
            </ul>
          </section>

          <section className={styles.group} aria-labelledby="more-connect">
            <p id="more-connect" className={styles.label}>{SHEET_COPY.connect}</p>
            <ul className={styles.list}>
              <li>
                <Link href="/contact" className={styles.row} onClick={close}>
                  <span className={styles.icon}><img src="/art/sheet/sheet-plane.webp" alt="" width={40} height={40} decoding="async" draggable={false} /></span>
                  <span className={styles.text}><span className={styles.name}>{SHEET_COPY.connectLabel}</span></span>
                  <ChevronRight className={styles.end} size={18} aria-hidden="true" />
                </Link>
              </li>
              {external.map((link: { href: string; label: string; icon: ReactNode }) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.row} target="_blank" rel="noopener noreferrer">
                    <span className={styles.icon}>{link.icon}</span>
                    <span className={styles.text}>
                      <span className={styles.name}>{link.label}</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <ExternalLink className={styles.end} size={17} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* paper camp strip at the end of the list (98px, full sheet width, as on the reference) */}
          <div className={styles.land} aria-hidden="true" />
        </div>
      </div>
    </dialog>
  );
}

/** A 34px coloured tile holding a white filled glyph. */
function BrandTile({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <span className={styles.brandTile} style={{ background: bg }} aria-hidden="true">
      {children}
    </span>
  );
}

/** A row for a feature that ships in a later phase (Ask = 6, Tour = 5): visible, not actionable. */
function SoonRow({ icon, name, sub }: { icon: ReactNode; name: string; sub: string }) {
  return (
    <span className={styles.row} aria-disabled="true" title={SOON}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.sub}>{sub}</span>
      </span>
      <ChevronRight className={styles.end} size={18} aria-hidden="true" />
    </span>
  );
}
