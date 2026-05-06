"use client";

import dynamic from "next/dynamic";

const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div className="w-16 h-16 rounded-full animate-pulse" style={{ background: "rgba(201,168,76,0.15)" }} />
    </div>
  ),
});

export default function Hero3DWrapper() {
  return <Hero3D />;
}
