import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Caveat, Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import ThemeScript from "@/components/shell/ThemeScript";
import { SITE_NAME, siteUrl } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const TITLE: string = SITE_NAME + " | AI Product Manager & Full Stack Developer";
const DESCRIPTION: string = "AI Product Manager and Full Stack Developer. I shape and build AI products people can trust.";

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: TITLE,
    template: "%s · " + SITE_NAME,
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EFE6D2" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1427" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={fraunces.variable + " " + inter.variable + " " + caveat.variable}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="font-body min-h-screen">
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
