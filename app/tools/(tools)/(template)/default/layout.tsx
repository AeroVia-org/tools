import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Default Calculator",
  description: "Calculate the default value of a number",
};

export default function DefaultCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
