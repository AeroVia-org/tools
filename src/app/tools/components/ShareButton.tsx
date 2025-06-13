"use client";

import { cn } from "@/utils/utils";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ShareButton({ title, text, url, className, children }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text,
        url,
      });
    }
  };

  return (
    <button onClick={handleShare} className={cn(className, "cursor-pointer")}>
      {children ?? "Share"}
    </button>
  );
}
