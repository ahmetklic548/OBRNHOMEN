import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#1a1208",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          position: "relative",
        }}
      >
        {/* Hilal — CSS ile çizmek zor, O harfi + yıldız kullanıyoruz */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "#c9a84c",
              fontFamily: "serif",
              lineHeight: 1,
              letterSpacing: "-4px",
            }}
          >
            ☽
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 32,
            fontSize: 36,
            color: "#c9a84c",
          }}
        >
          ★
        </div>
      </div>
    ),
    { ...size }
  );
}
