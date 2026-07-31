import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a09",
          color: "#f4f1ea",
          padding: 72,
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -2, color: "#e8e4d8" }}>dc.production</div>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-end" }}>
          <div style={{ maxWidth: 820, fontSize: 96, fontWeight: 900, lineHeight: 0.92, textTransform: "uppercase" }}>
            From idea — to result.
          </div>
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 16,
              background: "linear-gradient(135deg, #1c1b18 0%, #e8e4d8 100%)",
              border: "1px solid rgba(232,228,216,.3)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}