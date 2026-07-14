"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { HouseLoader } from "@/components/ui/HouseLoader";
import { WelcomeScreen } from "@/components/ui/WelcomeScreen";

interface TransitionContextType {
  startTransition: () => void;
  stopTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function useTransitionContext() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransitionContext must be used within a RouteTransitionProvider");
  }
  return context;
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  // Aktifkan secara default agar muncul saat pertama kali aplikasi dimuat (F5)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Melacak stempel waktu mulai transisi agar loading minimum 1.2 detik (menunggu rumah tergambar selesai)
  const transitionStartRef = useRef<number>(Date.now());
  const pathname = usePathname();

  // Menangani penayangan saat initial mount (Refresh / F5)
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      // Mulai fade out setelah rumah selesai digambar (1.2 detik)
      setIsVisible(false);
      // Setelah animasi fade out selesai (300ms), benar-benar unmount
      setTimeout(() => {
        setIsTransitioning(false);
        setIsInitialMount(false);
      }, 300);
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Mematikan loading screen HANYA JIKA halaman benar-benar sudah selesai berpindah
  React.useEffect(() => {
    if (!isInitialMount) {
      const elapsed = Date.now() - transitionStartRef.current;
      const remaining = Math.max(0, 1200 - elapsed);

      const timeout = setTimeout(() => {
        // Mulai fade out
        setIsVisible(false);
        if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, remaining);

      return () => clearTimeout(timeout);
    }
  }, [pathname, isInitialMount]);

  // Memulai loading screen secara manual saat link diklik
  const startTransition = useCallback(() => {
    if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    transitionStartRef.current = Date.now(); // Catat waktu awal mulai transisi
    setIsTransitioning(true);
    setIsVisible(true);
  }, []);

  // Menghentikan loading screen (biasanya digunakan untuk refresh halaman yang sama)
  const stopTransition = useCallback(() => {
    const elapsed = Date.now() - transitionStartRef.current;
    const remaining = Math.max(0, 1200 - elapsed);

    setTimeout(() => {
      setIsVisible(false);
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, remaining);
  }, []);

  return (
    <TransitionContext.Provider value={{ startTransition, stopTransition }}>
      {isTransitioning && (
        <div
          className="fixed inset-0 z-[100]"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 300ms ease-out",
            pointerEvents: isVisible ? "auto" : "none",
          }}
        >
          {isInitialMount && pathname === "/login" ? (
            <WelcomeScreen isVisible={isVisible} />
          ) : (
            <HouseLoader />
          )}
        </div>
      )}
      {children}
    </TransitionContext.Provider>
  );
}
