import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Pembayaran } from '@/types';

export async function POST() {
  try {
    const db = readDb();
    const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const now = new Date();
    
    let isModified = false;
    
    db.penghuni.forEach(penghuni => {
      if (penghuni.tanggalKeluar) return; // Skip inactive tenants
      
      const kamar = db.kamar.find(k => k.id === penghuni.kamarId);
      if (!kamar) return;
      
      const masukDate = new Date(penghuni.tanggalMasuk);
      const dueDay = masukDate.getDate(); // Jatuh tempo = tanggal masuk
      
      // Mulai tagihan otomatis 1 bulan setelah tanggal masuk
      let currDate = new Date(masukDate.getFullYear(), masukDate.getMonth() + 1, 1);
      
      // Target = bulan depan (supaya tagihan bulan depan sudah muncul)
      const targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      
      while (currDate <= targetDate) {
        const bulanIndex = currDate.getMonth();
        const bulan = namaBulan[bulanIndex];
        const tahun = currDate.getFullYear();
        
        let bill = db.pembayaran.find(p => p.penghuniId === penghuni.id && p.bulan === bulan && p.tahun === tahun);
        
        if (!bill) {
          // Create missing bill automatically
          bill = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            penghuniId: penghuni.id,
            kamarId: kamar.id,
            bulan,
            tahun,
            jumlah: kamar.hargaPerBulan,
            tanggalBayar: null,
            status: "belum_bayar",
            createdAt: new Date().toISOString()
          };
          db.pembayaran.push(bill);
          isModified = true;
        }
        
        // Cek apakah status perlu diubah menjadi 'terlambat'
        if (bill.status === "belum_bayar" || bill.status === "terlambat") {
          const dueDate = new Date(tahun, bulanIndex, dueDay);
          // Toleransi waktu
          dueDate.setHours(23, 59, 59, 999);
          
          if (now > dueDate && bill.status !== "terlambat") {
            bill.status = "terlambat";
            isModified = true;
          } else if (now <= dueDate && bill.status === "terlambat") {
            bill.status = "belum_bayar";
            isModified = true;
          }
        }
        
        currDate.setMonth(currDate.getMonth() + 1);
      }
    });

    if (isModified) {
      writeDb(db);
    }
    
    return NextResponse.json(db.pembayaran);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
