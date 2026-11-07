"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth wheel scrolling. Skipped entirely for visitors who prefer reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis: Lenis = new Lenis({ autoRaf: true, anchors: true });
    return () => lenis.destroy();
  }, []);

  return null;
}
