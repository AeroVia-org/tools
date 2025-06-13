import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Rocket Equation Calculator",
  description: "Calculate rocket performance parameters using the Tsiolkovsky rocket equation",
};

export default function RocketEquationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
