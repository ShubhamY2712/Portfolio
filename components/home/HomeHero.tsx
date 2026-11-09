"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO } from "@/lib/home";
import styles from "./HomeHero.module.css";

// Three paper layers of the approved desk scene (style frame v14): room, Shubham, desk + props.
const LAYERS: { name: string; depth: number }[] = [
  { name: "plate", depth: 0 },
  { name: "person", depth: 0.3 },
  { name: "desk", depth: 0.6 },
];

type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/**
 * Full-width layered scene. Fine pointers get pointer parallax; touch devices get an
 * opt-in tilt button (iOS needs a tap before it shares motion). Scroll parallax is pure CSS.
 * Everything holds still under reduced motion.
 */
export default function HomeHero() {
  const stage = useRef<HTMLDivElement>(null);
  const [canTilt, setCanTilt] = useState<boolean>(false);
  const [tilting, setTilting] = useState<boolean>(false);

  function setOffset(mx: number, my: number): void {
    const el: HTMLDivElement | null = stage.current;
    if (!el) return;
    el.style.setProperty("--mx", mx.toFixed(3));
    el.style.setProperty("--my", my.toFixed(3));
  }

  // Pointer parallax for mouse / trackpad.
  useEffect(() => {
    const el: HTMLDivElement | null = stage.current;
    const host: HTMLElement | null | undefined = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent): void => {
      const r: DOMRect = el.getBoundingClientRect();
      setOffset(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const leave = (): void => setOffset(0, 0);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Offer tilt only on touch devices that report orientation (decided after mount, so no hydration mismatch).
  useEffect(() => {
    const touch: boolean = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const still: boolean = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanTilt(touch && !still && "DeviceOrientationEvent" in window);
  }, []);

  useEffect(() => {
    if (!tilting) return;
    let base: number | null = null;
    const onTilt = (e: DeviceOrientationEvent): void => {
      if (e.gamma === null || e.beta === null) return;
      if (base === null) base = e.beta; // hold-angle the visitor started from
      const clamp = (v: number): number => Math.max(-1, Math.min(1, v));
      setOffset(clamp(e.gamma / 25), clamp((e.beta - base) / 25));
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [tilting]);

  async function startTilt(): Promise<void> {
    const api: OrientationPermission = window.DeviceOrientationEvent as unknown as OrientationPermission;
    if (typeof api.requestPermission === "function") {
      try {
        if ((await api.requestPermission()) !== "granted") return;
      } catch {
        return;
      }
    }
    setTilting(true);
  }

  return (
    <section
      className={styles.hero}
      aria-label="Paper-craft scene: Shubham at his desk sketching a user flow, with a glass of cutting chai, a laptop, a wall of pinned wireframes and a window onto Pune and Sinhagad"
    >
      <div className={styles.stage} ref={stage}>
        {LAYERS.map((layer: { name: string; depth: number }) => (
          <div key={layer.name} className={styles.layer} style={{ ["--d" as string]: layer.depth }}>
            <img
              className="d"
              src={`/art/hero/hero-day-${layer.name}.webp`}
              alt=""
              width={2560}
              height={1441}
              decoding="async"
              draggable={false}
            />
            <img
              className="n"
              src={`/art/hero/hero-night-${layer.name}.webp`}
              alt=""
              width={2560}
              height={1441}
              decoding="async"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {canTilt && !tilting && (
        <button type="button" className={styles.tilt} onClick={startTilt}>
          {INTRO.tilt}
        </button>
      )}

      <svg className={styles.torn} viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
        <path
          className={styles.ridge}
          d="M0,40 L0,7.9 L17,11.8 L32,10.4 L53,4.7 L76,4.4 L98,4.8 L113,9.1 L142,5.5 L160,11.5 L191,10.9 L212,15.7 L227,14.3 L246,5.7 L262,7.7 L291,6.2 L316,11.7 L336,10.6 L351,4.7 L369,12.2 L391,7.8 L415,9.4 L435,13.5 L461,6.9 L486,10.3 L515,12.8 L535,15.8 L551,9.0 L578,5.8 L601,4.5 L627,13.2 L652,14.5 L671,12.3 L696,11.0 L718,14.1 L749,9.7 L775,4.7 L802,11.8 L834,13.9 L853,8.6 L879,4.3 L901,6.0 L917,4.7 L945,5.6 L963,8.7 L993,5.0 L1000,10.0 L1000,40 Z"
        />
        <path
          className={styles.sheet}
          transform="translate(0 9)"
          d="M0,40 L0,3.6 L30,7.4 L59,4.1 L89,1.5 L119,5.0 L154,0.8 L179,0.7 L215,5.5 L234,7.9 L273,5.2 L304,1.3 L323,4.2 L342,1.5 L365,0.2 L394,3.5 L430,4.2 L462,4.0 L495,3.7 L519,8.0 L559,6.7 L592,2.5 L615,2.3 L635,6.1 L662,6.8 L688,7.7 L725,0.0 L747,7.3 L776,7.8 L803,0.6 L834,6.2 L858,0.7 L884,7.7 L918,0.9 L942,0.8 L961,6.4 L983,4.5 L1000,4.0 L1000,40 Z"
        />
      </svg>
    </section>
  );
}
