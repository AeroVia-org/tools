import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Radar Range Equation Calculator",
  description: "Estimate maximum radar detection range based on system parameters using the Radar Range Equation.",
};

export default function RadarRangeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
