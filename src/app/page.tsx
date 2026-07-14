"use client";

import { useKamar } from "@/hooks/useKamar";
import { usePenghuni } from "@/hooks/usePenghuni";
import { usePembayaran } from "@/hooks/usePembayaran";
import { StatCard } from "@/components/dashboard/StatCard";
import { BedDouble, Users, Wallet, AlertCircle } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Halaman utama Dashboard pemilik kost
export default function Dashboard() {
  const { dataKamar, isLoading: loadingKamar, error: errorKamar } = useKamar();
  const { dataPenghuni, isLoading: loadingPenghuni, error: errorPenghuni } = usePenghuni();
  const { dataPembayaran, isLoading: loadingPembayaran, error: errorPembayaran } = usePembayaran();

  const isLoading = loadingKamar || loadingPenghuni || loadingPembayaran;
  const error = errorKamar || errorPenghuni || errorPembayaran;

  const totalKamar = dataKamar.length;
  const kamarTerisi = dataKamar.filter(k => k.status === "terisi").length;
  const kamarKosong = dataKamar.filter(k => k.status === "tersedia").length;
  
  const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const currentMonthIndex = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Pendapatan bulan berjalan (total pembayaran lunas di bulan & tahun saat ini)
  const pendapatanBulanIni = dataPembayaran
    .filter(p => {
      if (p.status !== "lunas" || !p.tanggalBayar) return false;
      const tglBayar = new Date(p.tanggalBayar);
      return tglBayar.getMonth() === currentMonthIndex && tglBayar.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  // Menentukan bulan & tahun untuk bulan depan
  const targetBulanDepan = new Date(currentYear, currentMonthIndex + 1, 1);
  const namaBulanDepan = namaBulan[targetBulanDepan.getMonth()];
  const tahunDepan = targetBulanDepan.getFullYear();

  // Menyaring daftar penghuni aktif yang belum membayar tagihan bulan depan
  const tagihanBulanDepan = dataPembayaran.filter(p => {
    // 1. Tagihan harus sesuai bulan depan & tahun depan
    if (p.bulan !== namaBulanDepan || p.tahun !== tahunDepan) return false;
    
    // 2. Status tagihan harus 'belum_bayar'
    if (p.status !== "belum_bayar") return false;

    // 3. Pastikan penghuni masih aktif (belum keluar)
    const penghuni = dataPenghuni.find(pengh => pengh.id === p.penghuniId);
    return penghuni && !penghuni.tanggalKeluar;
  });

  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // Menyaring 5 penghuni yang baru masuk dalam sebulan terakhir
  const penghuniTerbaru = dataPenghuni
    .filter(p => new Date(p.tanggalMasuk) >= oneMonthAgo)
    .sort((a, b) => new Date(b.tanggalMasuk).getTime() - new Date(a.tanggalMasuk).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-8 bg-muted rounded w-36 mb-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive animate-bounce" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Gagal Memuat Dashboard</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Kamar" 
          value={totalKamar} 
          colorClass="bg-gradient-to-tr from-blue-500 to-blue-600"
        />
        <StatCard 
          title="Kamar Terisi" 
          value={kamarTerisi} 
          colorClass="bg-gradient-to-tr from-emerald-400 to-emerald-500"
        />
        <StatCard 
          title="Kamar Kosong" 
          value={kamarKosong} 
          colorClass="bg-gradient-to-tr from-amber-400 to-amber-500"
        />
        <StatCard 
          title="Pendapatan Bulan Ini" 
          value={formatRupiah(pendapatanBulanIni)} 
          colorClass="bg-gradient-to-tr from-indigo-500 to-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Penghuni Terbaru */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Penghuni Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {penghuniTerbaru.length > 0 ? (
              <Table className="min-w-[400px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kamar</TableHead>
                    <TableHead>Tgl Masuk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {penghuniTerbaru.map((penghuni) => {
                    const kamar = dataKamar.find(k => k.id === penghuni.kamarId);
                    return (
                      <TableRow key={penghuni.id}>
                        <TableCell className="font-medium text-foreground">{penghuni.nama}</TableCell>
                        <TableCell className="text-muted-foreground">{kamar ? kamar.nomorKamar : "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(penghuni.tanggalMasuk)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">Belum ada data penghuni</div>
            )}
          </CardContent>
        </Card>

        {/* Card Tagihan Bulan Depan dengan scroll bar jika > 5 */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-foreground flex justify-between items-center">
              <span>Tagihan Bulan Depan</span>
              <span className="text-xs font-normal text-muted-foreground">({namaBulanDepan} {tahunDepan})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tagihanBulanDepan.length > 0 ? (
              <div className="max-h-[245px] overflow-y-auto pr-1">
                <Table className="min-w-[400px]">
                  <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                      <TableHead>Penghuni</TableHead>
                      <TableHead>Kamar</TableHead>
                      <TableHead>Bulan</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tagihanBulanDepan.map((bayar) => {
                      const penghuni = dataPenghuni.find(p => p.id === bayar.penghuniId);
                      const kamar = dataKamar.find(k => k.id === bayar.kamarId);
                      return (
                        <TableRow key={bayar.id}>
                          <TableCell className="font-medium text-foreground">{penghuni ? penghuni.nama : "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{kamar ? kamar.nomorKamar : "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{bayar.bulan}</TableCell>
                          <TableCell className="text-muted-foreground">{formatRupiah(bayar.jumlah)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-none">
                              {bayar.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">Tidak ada tagihan bulan depan yang belum dibayar 🎉</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
