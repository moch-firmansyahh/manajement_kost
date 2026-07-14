"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-4 text-center">
      <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6 shadow-sm">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">Terjadi Kesalahan Sistem</h2>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        Aplikasi mengalami gangguan teknis saat memproses halaman ini. Kami telah mencatat kesalahan ini.
      </p>
      {error.message && (
        <pre className="p-3 bg-muted rounded-md text-xs font-mono text-muted-foreground max-w-lg overflow-x-auto mb-6 text-left w-full border border-border">
          {error.message}
        </pre>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => reset()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <RotateCcw className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </Button>
      </div>
    </div>
  );
}
