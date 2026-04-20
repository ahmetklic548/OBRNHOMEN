"use client";

import dynamic from "next/dynamic";

const HajjMan = dynamic(() => import("./HajjMan"), { ssr: false });

export default function HajjManWrapper() {
  return <HajjMan />;
}
