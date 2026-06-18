import { ImageResponse } from "next/og";

export const alt = "Designers Drama";
export const size = {
  width: 1200,
  height: 630
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
          background: "#ffffff",
          color: "#070707",
          padding: "72px",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase"
          }}
        >
          <span>Designers Drama</span>
          <span
            style={{
              width: 34,
              height: 34,
              background: "#fc042e",
              transform: "rotate(45deg)"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              maxWidth: 860,
              fontSize: 104,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: -2,
              textTransform: "uppercase"
            }}
          >
            Bold objects for everyday drama.
          </div>
          <div
            style={{
              width: 420,
              height: 10,
              background: "#fc042e"
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#6f6f6f",
            fontSize: 28
          }}
        >
          <span>Accessories</span>
          <span>Objects</span>
          <span>Designers Drama</span>
        </div>
      </div>
    ),
    size
  );
}
