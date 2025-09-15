import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - International Standard Atmosphere Calculator",
  description: "Calculate atmospheric properties at different altitudes based on the ISA model",
};

export default function IsaCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
