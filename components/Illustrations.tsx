"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

/*
 * Hand-made line illustrations, drawn in code (no image files, no packages).
 * They use `currentColor`, so wrap them in a text-* class to recolor.
 * Everything here is decorative: aria-hidden, and it never moves when the
 * visitor has "reduce motion" turned on (CSS animations are disabled
 * globally in globals.css, Motion animations are handled below).
 */

type IconProps = { className?: string; style?: CSSProperties };

function Svg({
  children,
  viewBox = "0 0 24 24",
  className = "",
  style,
}: {
  children: ReactNode;
  viewBox?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
}

export function Sparkle({ className = "", style }: IconProps) {
  return (
    <Svg className={className} style={style}>
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </Svg>
  );
}

export function CodeBrackets({ className = "", style }: IconProps) {
  return (
    <Svg className={className} style={style}>
      <path d="M8 6 3 12l5 6M16 6l5 6-5 6M13.5 4l-3 16" />
    </Svg>
  );
}

export function Bulb({ className = "", style }: IconProps) {
  return (
    <Svg className={className} style={style}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3Z" />
    </Svg>
  );
}

export function ChartUp({ className = "", style }: IconProps) {
  return (
    <Svg className={className} style={style}>
      <path d="M3 20h18M5 16l4-5 4 3 6-8M15 6h4v4" />
    </Svg>
  );
}

/** Floating doodles around the hero photo. */
export function HeroDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Bulb className="absolute -left-6 top-6 h-9 w-9 text-accent/80 motion-safe:animate-float sm:-left-10" />
      <CodeBrackets
        className="absolute -right-8 top-10 h-10 w-10 text-accent-light/70 motion-safe:animate-float-slow sm:-right-12"
        style={{ animationDelay: "1.2s" }}
      />
      <ChartUp
        className="absolute -left-8 bottom-10 h-9 w-9 text-accent-light/60 motion-safe:animate-float-slow sm:-left-12"
        style={{ animationDelay: "0.6s" }}
      />
      <Sparkle
        className="absolute -right-4 bottom-4 h-7 w-7 text-accent motion-safe:animate-float sm:-right-6"
        style={{ animationDelay: "2s" }}
      />
      {/* Dashed orbit ring */}
      <svg viewBox="0 0 200 200" className="absolute inset-[-14%] h-[128%] w-[128%] text-accent/25 motion-safe:animate-spin-slow">
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 6" />
        <circle cx="100" cy="4" r="2.4" fill="currentColor" className="text-accent" />
      </svg>
    </div>
  );
}

/** About: an idea (bulb) connected to code (window) by a line that draws itself. */
export function IdeaToCode({ className = "" }: { className?: string }) {
  const reduce: boolean | null = useReducedMotion();
  return (
    <svg viewBox="0 0 320 140" fill="none" aria-hidden="true" focusable="false" className={className}>
      {/* bulb */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
        <path d="M44 40a22 22 0 0 0-13 39.6c2.5 1.9 4 4.7 4 7.8v3.6h18v-3.6c0-3.1 1.5-5.9 4-7.8A22 22 0 0 0 44 40Z" />
        <path d="M36 98h16M38 105h12" />
        <path d="M44 28v-8M18 36l-6-5M70 36l6-5" opacity="0.7" />
      </g>
      {/* connecting path */}
      <motion.path
        d="M78 70 C 120 30, 170 110, 214 70"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 7"
        strokeLinecap="round"
        className="text-accent-light/70"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: reduce ? 0 : 1.4, ease: "easeInOut" }}
      />
      <path d="M206 64l9 6-9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-accent-light/70" />
      {/* code window */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
        <rect x="222" y="34" width="88" height="72" rx="10" />
        <path d="M222 50h88" />
        <circle cx="233" cy="42" r="1.6" fill="currentColor" />
        <circle cx="241" cy="42" r="1.6" fill="currentColor" />
        <path d="M244 68l-8 8 8 8M288 68l8 8-8 8M270 64l-8 26" />
      </g>
    </svg>
  );
}

/** Footer: a paper plane with a looping dotted trail. */
export function PaperPlane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 120" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M8 104 C 50 110, 70 60, 100 70 S 130 110, 150 80 S 165 40, 178 36"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeDasharray="3 7"
        strokeLinecap="round"
        className="text-accent/50"
      />
      <g stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="text-accent">
        <path d="M176 38 212 12 198 58 186 46Z" />
        <path d="M212 12 186 46l-2 18 10-12" />
      </g>
    </svg>
  );
}

/** Small hand-drawn squiggle used under section eyebrows. */
export function Squiggle({ className = "" }: { className?: string }) {
  const reduce: boolean | null = useReducedMotion();
  return (
    <svg viewBox="0 0 120 12" fill="none" aria-hidden="true" focusable="false" className={className}>
      <motion.path
        d="M2 8 C 12 2, 22 2, 32 7 S 52 12, 62 6 S 82 1, 92 6 S 110 10, 118 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0 : 0.9, ease: "easeInOut" }}
      />
    </svg>
  );
}

/** Recognition: a laurel-wrapped medal. */
export function LaurelMedal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true" focusable="false" className={className}>
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light/60">
        <path d="M46 96C30 84 24 64 30 44M114 96c16-12 22-32 16-52" />
        <path d="M32 54c-8-2-12-8-12-14 7 0 12 5 12 14ZM30 70c-8 0-13-5-14-11 7-1 13 4 14 11ZM36 85c-8 2-14-2-17-7 6-3 13 0 17 7Z" />
        <path d="M128 54c8-2 12-8 12-14-7 0-12 5-12 14ZM130 70c8 0 13-5 14-11-7-1-13 4-14 11ZM124 85c8 2 14-2 17-7-6-3-13 0-17 7Z" />
      </g>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
        <path d="M66 14l-8 30M94 14l8 30" />
        <circle cx="80" cy="66" r="24" />
        <path d="M80 54l3.5 7.2 8 1.1-5.8 5.6 1.4 7.9L80 72l-7.1 3.8 1.4-7.9-5.8-5.6 8-1.1Z" />
      </g>
    </svg>
  );
}

/** Soft dotted grid that fades out toward the edges. */
export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 -z-10 " + className}
      style={{
        backgroundImage: "radial-gradient(rgba(255,197,61,0.22) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        maskImage: "radial-gradient(60% 60% at 50% 40%, black, transparent)",
        WebkitMaskImage: "radial-gradient(60% 60% at 50% 40%, black, transparent)",
      }}
    />
  );
}
