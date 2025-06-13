import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Reynolds Number Calculator",
  description: "Calculate Reynolds number for various fluid flow scenarios and conditions",
};

export default function ReynoldsCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
