"use client";

import { useEffect } from "react";

/**
 * Section headings and cards rise in as they scroll into view (reference: 12px rise,
 * .5s, 70ms stagger, triggered at 20% visible). Content stays visible until this runs,
 * and under reduced motion the CSS keeps everything still.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const items: HTMLElement[] = [
      ...document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ];
    document.querySelectorAll<HTMLElement>("[data-reveal-list]").forEach((list: HTMLElement) => {
      [...list.children].forEach((li: Element, i: number) => {
        if (!(li instanceof HTMLElement)) return;
        li.style.setProperty("--i", String(i + 1));
        li.setAttribute("data-reveal", "");
        items.push(li);
      });
    });

    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-revealed", "");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.2 },
    );
    items.forEach((el: HTMLElement) => io.observe(el));
    document.documentElement.setAttribute("data-reveal-on", "");

    return () => {
      io.disconnect();
      document.documentElement.removeAttribute("data-reveal-on");
    };
  }, []);

  return null;
}
