import type { Config } from "tailwindcss";

// Dark "Amber Yellow" theme. Token NAMES are unchanged from the original
// light theme, so every component picks up the new palette automatically:
//   paper   = page background      surface = card background
//   ink     = main text            ink-soft = secondary text
//   primary = amber (buttons)      accent  = amber (highlights, eyebrows)
//   *-soft  = dark amber tints     line    = hairline borders
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#0D0B07",
        surface: "#15120B",
        ink: "#F7F4EE",
        "ink-soft": "#ABA396",
        primary: "#FFC53D",
        "primary-soft": "#2A2110",
        accent: "#FFC53D",
        "accent-soft": "#3D2C05",
        "accent-deep": "#B7791F",
        "accent-light": "#FDE68A",
        line: "#2B251A",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-plex)", "sans-serif"],
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
      boxShadow: {
        card: "0 1px 0 rgba(255, 255, 255, 0.03) inset",
        "card-hover": "0 0 0 1px rgba(255, 197, 61, 0.25), 0 18px 48px -18px rgba(255, 197, 61, 0.28)",
        glow: "0 0 80px 10px rgba(255, 197, 61, 0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
