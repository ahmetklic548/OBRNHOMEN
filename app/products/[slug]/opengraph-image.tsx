import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/products";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  const name = product?.name ?? "OBRNHOMEN";
  const category = product?.category ?? "Hediyelik";
  const price = product?.price
    ? `${product.price.toLocaleString("tr-TR")} ₺`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1D1D1F",
        }}
      >
        {/* Left — text */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 56px",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.4em",
              color: "#c9a84c",
              textTransform: "uppercase",
            }}
          >
            OBRNHOMEN · {category}
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: 520,
            }}
          >
            {name}
          </div>
          {price && (
            <div
              style={{
                fontSize: 28,
                color: "#c9a84c",
                fontWeight: 600,
              }}
            >
              {price}
            </div>
          )}
          <div
            style={{
              width: 40,
              height: 2,
              background: "#c9a84c",
              marginTop: 8,
            }}
          />
          <div
            style={{
              fontSize: 14,
              color: "#86868B",
              letterSpacing: "0.05em",
            }}
          >
            obrnhomen.com
          </div>
        </div>

        {/* Right — accent bar */}
        <div
          style={{
            width: 8,
            background: "#c9a84c",
            alignSelf: "stretch",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
