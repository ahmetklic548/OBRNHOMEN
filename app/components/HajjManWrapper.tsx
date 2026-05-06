"use client";

import dynamic from "next/dynamic";

const HajjMan = dynamic(() => import("./HajjMan"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <div className="w-16 h-16 rounded-full animate-pulse" style={{ background: "rgba(201,168,76,0.1)" }} />
    </div>
  ),
});

export default function HajjManWrapper() {
  return <HajjMan />;
}
