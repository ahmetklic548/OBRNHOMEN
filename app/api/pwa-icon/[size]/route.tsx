import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const s = parseInt(size) || 192;

  return new ImageResponse(
    (
      <div
        style={{
          width: s, height: s,
          background: "#1a1208",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: s * 0.18,
          position: "relative",
        }}
      >
        <div style={{ fontSize: s * 0.55, lineHeight: 1, color: "#c9a84c", display: "flex" }}>☽</div>
        <div style={{
          position: "absolute",
          top: s * 0.12,
          right: s * 0.14,
          fontSize: s * 0.2,
          color: "#c9a84c",
          display: "flex",
        }}>★</div>
      </div>
    ),
    { width: s, height: s }
  );
}
