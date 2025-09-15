import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Isentropic Flow Calculator",
  description: "Calculate pressure, temperature, and density ratios across an isentropic flow",
};

export default function IsentropicFlowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
