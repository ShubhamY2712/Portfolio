import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Only finished pages are listed; "coming soon" stubs join as each phase ships.
const PATHS: string[] = ["/", "/work/invai", "/work/creditsaathi"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base: URL = siteUrl();
  return PATHS.map((path: string) => ({ url: new URL(path, base).toString() }));
}
