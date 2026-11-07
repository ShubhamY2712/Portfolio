// One list of destinations shared by the header tabs, the mobile dock and the
// More sheet, so labels and active-state rules never drift apart.

export type NavKey = "home" | "experience" | "portfolio" | "about" | "certifications";

export type NavItem = {
  key: NavKey;
  href: string;
  label: string; // header tab + More sheet
  dockLabel: string; // mobile dock (short)
};

export const NAV: NavItem[] = [
  { key: "home", href: "/", label: "Home", dockLabel: "Home" },
  { key: "experience", href: "/work", label: "Experience", dockLabel: "Xp" },
  { key: "portfolio", href: "/projects", label: "Portfolio", dockLabel: "Portfolio" },
  { key: "about", href: "/about", label: "About", dockLabel: "About" },
  { key: "certifications", href: "/certifications", label: "Certifications", dockLabel: "Certs" },
];

/**
 * Which tab owns a path. /work is the Experience page, but the case studies
 * at /work/<slug> belong to Portfolio. /contact, /card and /teardown own no tab.
 */
export function activeNav(pathname: string): NavKey | null {
  if (pathname === "/") return "home";
  if (pathname === "/work") return "experience";
  if (pathname.startsWith("/work/") || pathname === "/projects" || pathname.startsWith("/projects/")) return "portfolio";
  if (pathname === "/about") return "about";
  if (pathname === "/certifications") return "certifications";
  return null;
}

/** Copy approved for the More sheet (7 Nov 2026). */
export const SHEET_COPY = {
  title: "Menu",
  explore: "Explore",
  connect: "Connect",
  askLabel: "Ask Shubham",
  askSub: "My AI portfolio assistant",
  tourLabel: "Take a tour",
  tourSub: "A 30-second look around",
  connectLabel: "Let’s connect",
} as const;

/** Shown on controls whose feature lands in a later phase (Ask = Phase 6, Tour = Phase 5). */
export const SOON: string = "Coming soon";
