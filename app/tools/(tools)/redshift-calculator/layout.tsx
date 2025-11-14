import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Redshift Calculator",
  description: "Calculate cosmological distances, lookback times, and redshift relationships for astronomical objects.",
};

export default function DefaultCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
