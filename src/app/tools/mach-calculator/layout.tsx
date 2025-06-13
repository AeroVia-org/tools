import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Mach Number Calculator",
  description: "Calculate Mach number and local speed of sound based on airspeed and altitude",
};

export default function MachCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
