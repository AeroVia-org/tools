import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Unit Converter",
  description: "Convert between different measurement units for aerospace applications",
};

export default function UnitConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
