import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Propellant Mass Fraction Calculator",
  description: "Calculate the propellant mass fraction for rockets and spacecraft.",
};

export default function PropellantMassFractionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
