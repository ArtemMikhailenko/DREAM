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
          background: "#fbfaf7",
          color: "#111111",
          padding: 72,
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 900 }}>DREAM</div>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-end" }}>
          <div style={{ maxWidth: 760, fontSize: 82, fontWeight: 900, lineHeight: 0.94 }}>
            Видео, реклама и SMM для заявок
          </div>
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: 16,
              background: "linear-gradient(135deg, #d45238, #f6c453 48%, #0c7a67)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}