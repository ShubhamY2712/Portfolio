import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Poppins, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import MotionProvider from "@/components/MotionProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

/** Absolute base URL so Open Graph / icon URLs resolve correctly. */
function siteUrl(): URL {
  const explicit: string | undefined = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProd: string | undefined = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercel: string | undefined = process.env.VERCEL_URL;
  const raw: string = explicit
    ? explicit
    : vercelProd
      ? "https://" + vercelProd
      : vercel
        ? "https://" + vercel
        : "http://localhost:3000";
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: profile } = await supabase.from("profile").select("name, tagline").eq("id", 1).single();

  const name: string = profile?.name || "Portfolio";
  const tagline: string = profile?.tagline || "";
  const title: string = name + " | AI Product Manager & AI/ML Builder";

  return {
    metadataBase: siteUrl(),
    title: {
      default: title,
      template: "%s | " + name,
    },
    description: tagline,
    openGraph: {
      title,
      description: tagline,
      type: "website",
      siteName: name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: tagline,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0D0B07",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable + " " + plexSans.variable}>
      <body className="font-body min-h-screen">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
