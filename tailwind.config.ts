import type { Config } from "tailwindcss";

// Paper-world theme (v1.0). Every colour is a CSS variable holding "R G B"
// channels (see app/globals.css), so light/dark swap at runtime and opacity
// modifiers like `border-accent/40` keep working.
// The v0 token NAMES are kept as aliases so existing components still compile:
//   surface = ivory   line = paper edge   primary/accent = rust
//   *-soft = sticky-note tint   accent-deep / accent-light = terracotta
const token = (name: string): string => `rgb(var(--c-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: token("paper"),
        ivory: token("ivory"),
        "paper-2": token("paper-2"),
        ink: token("ink"),
        "ink-2": token("ink-2"),
        "ink-soft": token("ink-soft"),
        rust: token("rust"),
        terracotta: token("terracotta"),
        kraft: token("kraft"),
        note: token("note"),
        forest: token("forest"),
        steel: token("steel"),
        "mat-side": token("mat-side"),
        // v0 aliases
        surface: token("ivory"),
        line: token("line"),
        primary: token("rust"),
        "primary-soft": token("note"),
        accent: token("rust"),
        "accent-soft": token("note"),
        "accent-deep": token("terracotta"),
        "accent-light": token("terracotta"),
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      maxWidth: {
        content: "1100px",
        prose: "65ch",
      },
      fontSize: {
        "display-sm": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-md": ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "display-lg": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-xl": ["4rem", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
      },
      transitionTimingFunction: {
        paper: "cubic-bezier(.22, 1, .36, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "spin-slow": "spin-slow 24s linear infinite",
      },
      boxShadow: {
        card: "2px 2px 0 rgb(var(--c-mat-side) / .35)",
        "card-hover": "0 0 0 1px rgb(var(--c-rust) / .25), 0 18px 48px -18px rgb(var(--c-rust) / .28)",
        glow: "0 0 80px 10px rgb(var(--c-rust) / .18)",
      },
    },
  },
  plugins: [],
};
export default config;
