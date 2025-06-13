import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AeroVia - Tools",
  description: "Aerospace engineering calculators and tools for educational use",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
