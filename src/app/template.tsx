"use client";

import { cn } from "@/lib/utils";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out fill-mode-both")}>
      {children}
    </div>
  );
}
