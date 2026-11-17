import type { Metadata } from "next";
import PanelClient from "./PanelClient";

export const metadata: Metadata = {
  title: "Kafile Paneli",
  description: "Kafilenizin linkinden gelen siparişler ve komisyonunuz.",
  robots: { index: false, follow: false },
};

export default function KafilePanelPage() {
  return <PanelClient />;
}
