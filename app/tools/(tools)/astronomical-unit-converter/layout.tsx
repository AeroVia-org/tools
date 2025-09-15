import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Astronomical Unit Converter",
  description: "Convert between AU, km, meters, light-years, parsecs, and lunar distance",
};

export default function AstronomicalUnitConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
