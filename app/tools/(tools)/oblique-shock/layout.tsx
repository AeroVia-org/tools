import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Oblique Shock Calculator",
  description: "Calculate properties across oblique shock waves based on upstream conditions.",
};

export default function ObliqueShockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
