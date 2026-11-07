import type { NavKey } from "@/components/shell/nav";

// Paper-craft dock icons (ChatGPT art, processed 7 Nov 2026). One set serves
// both themes because the dock is frosted glass in both.
const ICONS: Record<NavKey, string> = {
  home: "/art/dock/dock-home.webp",
  experience: "/art/dock/dock-experience.webp",
  portfolio: "/art/dock/dock-portfolio.webp",
  about: "/art/dock/dock-about.webp",
  certifications: "/art/dock/dock-certs.webp",
};

export function NavIcon({ navKey, size }: { navKey: NavKey; size: number }) {
  return <img src={ICONS[navKey]} alt="" width={size} height={size} decoding="async" draggable={false} />;
}

/** The illustrated Shubham head (approved Phase 0 mascot), cropped square for icon slots. */
export function MascotIcon({ size }: { size: number }) {
  return (
    <>
      <img className="d" src="/art/mascot/mascot-icon-day.webp" alt="" width={size} height={size} decoding="async" draggable={false} />
      <img className="n" src="/art/mascot/mascot-icon-night.webp" alt="" width={size} height={size} decoding="async" draggable={false} />
    </>
  );
}

/** The full mascot sticker (head and shoulders, 640 x 848 source ratio). */
export function MascotSticker({ width }: { width: number }) {
  const height: number = Math.round((width * 848) / 640);
  return (
    <>
      <img className="d" src="/art/mascot/mascot-day.webp" alt="" width={width} height={height} decoding="async" draggable={false} />
      <img className="n" src="/art/mascot/mascot-night.webp" alt="" width={width} height={height} decoding="async" draggable={false} />
    </>
  );
}
