import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Hohmann Transfer Calculator",
  description: "Calculate orbital transfer parameters for efficient spacecraft maneuvers",
};

export default function HohmannTransferLayout({ children }: { children: React.ReactNode }) {
  return children;
}
