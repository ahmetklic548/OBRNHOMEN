import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OBRNHOMEN | El İşi Tesbih, Seccade & Hac Umre Hediyeliği";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "#1D1D1F",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.4em",
              color: "#c9a84c",
              textTransform: "uppercase",
            }}
          >
            EL İŞÇİLİĞİ & ÖZGÜN TASARIM
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            OBRNHOMEN
          </div>
          <div
            style={{
              width: 60,
              height: 2,
              background: "#c9a84c",
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: "#86868B",
              letterSpacing: "0.05em",
              textAlign: "center",
              maxWidth: 700,
            }}
          >
            Tesbih · Seccade · Hac &amp; Umre Hediyeliği
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
