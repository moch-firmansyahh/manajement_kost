import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-4 text-center">
      <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
        <Compass className="h-8 w-8 animate-pulse" />
      </div>
      <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">404</h2>
      <h3 className="text-xl font-bold text-foreground mb-2">Halaman Tidak Ditemukan</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan ke alamat lain.
      </p>
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </Button>
    </div>
  );
}
