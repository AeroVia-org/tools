import { type Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroVia Tools",
  description: "A collection of aerospace engineering calculators and tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        {children}
      </body>
    </html>
  );
}
