"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./Carousel.module.css";

const DOT_STEP: number = 28; // 44px hit areas overlapping by 8px each side

/**
 * A grid on tablets and desktops; below 640px the same list becomes a one-card
 * swipe carousel (scroll-snap) with pill dots, as on the reference.
 */
export default function Carousel({
  gridClassName,
  label,
  count,
  children,
}: {
  gridClassName: string;
  label: string;
  count: number;
  children: ReactNode;
}) {
  const list = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState<number>(0);

  function onScroll(): void {
    const el: HTMLUListElement | null = list.current;
    const first: Element | null | undefined = el?.firstElementChild;
    if (!el || !first) return;
    const step: number = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0");
    if (step > 0) setIndex(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / step))));
  }

  function goTo(i: number): void {
    const el: HTMLUListElement | null = list.current;
    const item: Element | undefined = el?.children[i];
    if (!el || !(item instanceof HTMLElement)) return;
    el.scrollTo({ left: item.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  }

  return (
    <div className={styles.carousel}>
      <ul ref={list} className={styles.grid + " " + gridClassName} onScroll={onScroll} tabIndex={-1}>
        {children}
      </ul>
      <div className={styles.dots}>
        <span className={styles.pill} style={{ translate: 2 + index * DOT_STEP + "px 0" }} aria-hidden="true" />
        {Array.from({ length: count }, (_: unknown, i: number) => (
          <button
            key={i}
            type="button"
            className={styles.dot}
            aria-label={`Go to ${label} ${i + 1} of ${count}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
          >
            <span />
          </button>
        ))}
      </div>
    </div>
  );
}
