import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Sunrise/Sunset & Moonrise/Moonset Calculator",
  description: "Calculate sunrise, sunset, moonrise, and moonset times for any specific location and date.",
};

export default function DefaultCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
