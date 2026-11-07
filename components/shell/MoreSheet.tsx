"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode, SyntheticEvent } from "react";
import { ChevronRight, Compass, ExternalLink, FileText, Github, Linkedin, Send, X } from "lucide-react";
import Monogram from "@/components/shell/Monogram";
import { MascotIcon, MascotSticker, NavIcon } from "@/components/shell/NavIcon";
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
  if (links.linkedin) external.push({ href: links.linkedin, label: "LinkedIn", icon: <Linkedin size={22} strokeWidth={1.8} aria-hidden="true" /> });
  if (links.github) external.push({ href: links.github, label: "GitHub", icon: <Github size={22} strokeWidth={1.8} aria-hidden="true" /> });
  if (links.resumeUrl) external.push({ href: links.resumeUrl, label: "Resume", icon: <FileText size={22} strokeWidth={1.8} aria-hidden="true" /> });

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
              <MascotSticker width={56} />
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
                      <span className={styles.icon}><NavIcon navKey={item.key} size={36} /></span>
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
                    <SoonRow icon={<MascotIcon size={36} />} name={SHEET_COPY.askLabel} sub={SHEET_COPY.askSub} />
                  </li>,
                ];
              })}
              <li>
                <SoonRow icon={<Compass size={24} strokeWidth={1.8} aria-hidden="true" />} name={SHEET_COPY.tourLabel} sub={SHEET_COPY.tourSub} />
              </li>
            </ul>
          </section>

          <section className={styles.group} aria-labelledby="more-connect">
            <p id="more-connect" className={styles.label}>{SHEET_COPY.connect}</p>
            <ul className={styles.list}>
              <li>
                <Link href="/contact" className={styles.row} onClick={close}>
                  <span className={styles.icon}><Send size={22} strokeWidth={1.8} aria-hidden="true" /></span>
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
                    <ExternalLink className={styles.end} size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </dialog>
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
