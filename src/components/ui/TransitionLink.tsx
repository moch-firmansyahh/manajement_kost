"use client";

import React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTransitionContext } from "@/components/RouteTransitionProvider";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function TransitionLink({ children, href, className, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const { startTransition, stopTransition } = useTransitionContext();
  const pathname = usePathname();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    
    // Munculkan loading screen secara INSTAN
    startTransition();

    if (pathname === href.toString()) {
      // Jika di halaman yang sama, tampilkan efek "refresh" singkat
      setTimeout(() => {
        stopTransition();
      }, 1200);
      return;
    }

    // Mulai navigasi SEGERA setelah loader muncul (100ms cukup untuk transisi terlihat tanpa lag)
    setTimeout(() => {
      router.push(href.toString());
    }, 100);
  };

  return (
    <Link href={href} onClick={handleTransition} className={className} {...props}>
      {children}
    </Link>
  );
}
