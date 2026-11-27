"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO } from "@/lib/home";
import styles from "./HomeHero.module.css";

// Three paper layers of the approved desk scene (style frame v14): room, Shubham, desk + props.
// par = depth (reference values: back .05, subject .22, front .4); rng = pointer range in px.
const LAYERS: { name: string; par: number; rng: number }[] = [
  { name: "plate", par: 0.05, rng: 12 },
  { name: "person", par: 0.22, rng: 12 },
  { name: "desk", par: 0.4, rng: 25 },
];

type OrientationPermission = { requestPermission?: () => Promise<"granted" | "denied"> };

/**
 * Full-width layered scene. Fine pointers get pointer parallax; touch devices get an
 * opt-in tilt button (iOS needs a tap before it shares motion). Scroll motion is pure CSS:
 * the whole scene sinks at half speed under the intro sheet, and each layer shifts a little
 * by depth.
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
      data-scene=""
      aria-label="Paper-craft scene: Shubham at his desk sketching a user flow, with a glass of cutting chai, a laptop, a wall of pinned wireframes and a window onto Pune and Sinhagad"
    >
      <div className={styles.stage} ref={stage}>
        {LAYERS.map((layer: { name: string; par: number; rng: number }) => (
          <div key={layer.name} className={styles.layer} style={{ ["--par" as string]: layer.par, ["--rng" as string]: layer.rng + "px" }}>
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
    </section>
  );
}
