import { HiArrowLeft } from "react-icons/hi";

import Link from "next/link";
import { HiShare } from "react-icons/hi";
import ShareButton from "./ShareButton";

export default function Navigation({ name, description }: { name: string; description: string }) {
  return (
    <>
      {/* Top navigation bar */}
      <div className="grid grid-cols-2 gap-4 p-4 md:hidden">
        <Link
          href="/tools"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-white/90 px-4 py-3 shadow-lg dark:bg-gray-800/90"
        >
          <HiArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-gray-700 dark:text-gray-200">Back to Tools</span>
        </Link>
        <ShareButton
          title={name}
          text={description}
          url={typeof window !== "undefined" ? window.location.href : ""}
          className="flex items-center justify-center gap-2 rounded-2xl bg-white/90 px-4 py-3 shadow-lg dark:bg-gray-800/90"
        >
          <HiShare className="h-5 w-5" />
          <span>Share</span>
        </ShareButton>
      </div>

      {/* Desktop back button and share */}
      <div className="fixed top-28 left-10 z-40 hidden w-[220px] rounded-xl border border-b border-gray-200/50 bg-white/90 p-3 shadow-lg backdrop-blur-xs md:block dark:border-gray-700/50 dark:bg-gray-800/90">
        <Link
          href="/tools"
          className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all hover:bg-linear-to-r hover:from-blue-600/40 hover:to-purple-600/20 dark:text-gray-200"
        >
          <HiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Tools
        </Link>
        <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />
        <ShareButton
          title={name}
          text={description}
          url={typeof window !== "undefined" ? window.location.href : ""}
          className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all hover:bg-linear-to-r hover:from-blue-600/40 hover:to-purple-600/20 dark:text-gray-200"
        >
          <HiShare className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Share
        </ShareButton>
      </div>
    </>
  );
}
