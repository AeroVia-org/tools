import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Normal Shock Calculator",
  description: "Calculate property changes across a normal shock wave in supersonic flow",
};

export default function NormalShockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
