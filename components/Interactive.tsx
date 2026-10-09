"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

/**
 * A soft amber glow that follows the mouse on desktop. Hidden on touch
 * devices and when "reduce motion" is on.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce: boolean | null = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const fine: boolean = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    let frame: number = 0;
    const onMove = (e: PointerEvent): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el: HTMLDivElement | null = ref.current;
        if (!el) return;
        el.style.opacity = "1";
        el.style.background = `radial-gradient(420px circle at ${e.clientX}px ${e.clientY}px, rgba(255,197,61,0.07), transparent 70%)`;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-0 transition-opacity duration-500"
    />
  );
}

/** Gentle 3D tilt toward the cursor. Plain wrapper when "reduce motion" is on. */
export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce: boolean | null = useReducedMotion();
  const x: MotionValue<number> = useMotionValue(0);
  const y: MotionValue<number> = useMotionValue(0);
  const rotateX: MotionValue<number> = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 18 });
  const rotateY: MotionValue<number> = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 });

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e: ReactMouseEvent<HTMLDivElement>): void => {
    const rect: DOMRect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = (): void => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Counts up from 0 to `value` once it scrolls into view. */
export function CountUp({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView: boolean = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduce: boolean | null = useReducedMotion();
  const [shown, setShown] = useState<number>(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(value);
      return;
    }
    const duration: number = 1200;
    const start: number = performance.now();
    let frame: number = 0;
    const tick = (now: number): void => {
      const t: number = Math.min(1, (now - start) / duration);
      const eased: number = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
    </span>
  );
}

/**
 * Wrapper that drifts a few pixels toward the cursor on hover ("magnetic").
 * Static when "reduce motion" is on or on touch devices.
 */
export function Magnetic({ children, className = "", strength = 0.25 }: { children: ReactNode; className?: string; strength?: number }) {
  const reduce: boolean | null = useReducedMotion();
  const x: MotionValue<number> = useSpring(0, { stiffness: 200, damping: 15 });
  const y: MotionValue<number> = useSpring(0, { stiffness: 200, damping: 15 });

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e: ReactMouseEvent<HTMLDivElement>): void => {
    const rect: DOMRect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const onLeave = (): void => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div onMouseMove={onMove} onMouseLeave={onLeave} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
