import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

// Link-preview image (LinkedIn, X, WhatsApp, Slack...), generated from the
// name + tagline in your profile. Uses next/og, which ships with Next.js.
export const alt = "Portfolio preview card showing name and tagline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

type ProfileBits = { name: string; tagline: string };

async function getProfile(): Promise<ProfileBits> {
  const fallback: ProfileBits = { name: "Portfolio", tagline: "" };
  const url: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallback;
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data } = await supabase.from("profile").select("name, tagline").eq("id", 1).single();
    const row = data as { name: string | null; tagline: string | null } | null;
    return { name: row?.name || fallback.name, tagline: row?.tagline || "" };
  } catch {
    return fallback;
  }
}

export default async function OpengraphImage(): Promise<ImageResponse> {
  const { name, tagline } = await getProfile();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0D0B07",
          backgroundImage: "radial-gradient(circle at 50% -10%, rgba(255,197,61,0.30), rgba(13,11,7,0) 60%)",
          color: "#F7F4EE",
          borderTop: "10px solid #FFC53D",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 3, background: "#FFC53D" }} />
          <div style={{ fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#FFC53D" }}>
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#F7F4EE" }}>{name}</div>
          {tagline && (
            <div style={{ marginTop: 28, fontSize: 34, lineHeight: 1.35, color: "#ABA396", maxWidth: 980 }}>{tagline}</div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22, color: "#ABA396" }}>
          <div style={{ display: "flex" }}>Case studies · Research · Achievements</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#FFC53D",
              color: "#0D0B07",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            SY
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
