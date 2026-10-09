import { ImageResponse } from "next/og";

// iOS home-screen icon (Safari needs a PNG; app/icon.svg covers browsers).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D0B07",
          color: "#FFC53D",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>SY</div>
        <div style={{ marginTop: 14, width: 96, height: 6, borderRadius: 3, background: "#FFC53D" }} />
      </div>
    ),
    { ...size }
  );
}
