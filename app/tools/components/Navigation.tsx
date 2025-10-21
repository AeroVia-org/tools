import { HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import MobileRefWrapper from "@/components/MobileRefWrapper";

export default function Navigation() {
  return (
    <MobileRefWrapper>
      {/* Mobile navigation */}
      <div className="bg-card border-border/50 rounded-lg border md:hidden">
        <Link
          href="/tools"
          className="text-foreground hover:bg-accent group flex items-center justify-center gap-2 px-8 py-2.5"
        >
          <HiArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back to Tools
        </Link>
      </div>

      {/* Desktop navigation */}
      <div className="bg-card border-border/50 fixed top-25 left-10 z-40 hidden rounded-xl border p-2 shadow-lg backdrop-blur-sm md:block">
        <Link
          href="/tools"
          className="text-foreground hover:bg-accent group flex items-center gap-2 rounded-lg px-6 py-1.5 text-sm transition-all"
        >
          <HiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Tools
        </Link>
      </div>
    </MobileRefWrapper>
  );
}
