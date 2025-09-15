import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Orbital Calculator",
  description: "Calculate orbital parameters and visualize spacecraft trajectories",
};

export default function OrbitalCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
