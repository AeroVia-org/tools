import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "AeroVia - Tools",
  description: "Aerospace engineering calculators and tools for educational use",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // hardcoded the default-dark theme here because there is no theme switcher
    <html lang="en" className="default-dark">
      <body>{children}</body>
    </html>
  );
}
