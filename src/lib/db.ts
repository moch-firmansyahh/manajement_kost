import fs from 'fs';
import path from 'path';
import { Kamar, Penghuni, Pembayaran, StatusKamar, StatusPembayaran } from '@/types';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export interface DbSchema {
  kamar: Kamar[];
  penghuni: Penghuni[];
  pembayaran: Pembayaran[];
}

const INDONESIAN_NAMES = [
  "Aditya Pratama", "Siti Aminah", "Rian Hidayat", "Dewi Lestari", "Budi Santoso", 
  "Eka Wahyuni", "Fajar Nugraha", "Gita Puspita", "Hendra Wijaya", "Indah Permata", 
  "Joko Susilo", "Kartika Sari", "Lukman Hakim", "Maria Ulfah", "Novianti", 
  "Oscar Prasetyo", "Putri Utami", "Qori Aina", "Rudi Hermawan", "Santi Rahayu", 
  "Taufik Hidayat", "Umar Al-Faruq", "Vina Panduwinata", "Wawan Setiawan", "Yeni Astuti", 
  "Zainal Abidin", "Agus Budiman", "Citra Kirana", "Dani Ramadhan", "Elisa Fitri"
];

const NAMA_BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Membuat database default berisi data sewa kamar kost
function buatDbDefault(): DbSchema {
  const kamar: Kamar[] = [];
  const penghuni: Penghuni[] = [];
  const pembayaran: Pembayaran[] = [];

  // 1. Bangkitkan 30 Kamar
  // Lantai 1 s/d 3, masing-masing lantai berisi 10 kamar: 101-110, 201-210, 301-310
  for (let floor = 1; floor <= 3; floor++) {
    for (let num = 1; num <= 10; num++) {
      const id = `${floor}${num.toString().padStart(2, '0')}`; // Contoh: "101", "210"
      const nomorKamar = `${floor}${num.toString().padStart(2, '0')}`;
      
      let tipe = "Standard";
      let hargaPerBulan = 800000;
      let fasilitas = ["Kasur", "Lemari", "Kipas Angin", "Kamar Mandi Luar"];

      if (floor === 3) {
        tipe = "VIP";
        hargaPerBulan = 1500000;
        fasilitas = ["Kasur Springbed", "Lemari", "AC", "WiFi", "TV", "Kamar Mandi Dalam", "Water Heater"];
      } else if (num > 5) {
        tipe = "Deluxe";
        hargaPerBulan = 1200000;
        fasilitas = ["Kasur", "Lemari", "AC", "WiFi", "Kamar Mandi Dalam"];
      }

      // Distribusi status awal kamar:
      // 25 kamar pertama diatur ke status 'terisi' karena kita akan mengaitkan penghuni aktif ke kamar tersebut.
      // Indeks kamar 25-27 (kamar 306, 307, 308) -> 'tersedia'
      // Indeks kamar 28-29 (kamar 309, 310) -> 'maintenance'
      let status: StatusKamar = "terisi";
      const index = (floor - 1) * 10 + (num - 1);
      if (index === 25 || index === 26 || index === 27) {
        status = "tersedia";
      } else if (index === 28 || index === 29) {
        status = "maintenance";
      }

      kamar.push({
        id,
        nomorKamar,
        lantai: floor,
        tipe,
        hargaPerBulan,
        fasilitas,
        status,
        createdAt: "2024-01-01T00:00:00.000Z",
      });
    }
  }

  // 2. Bangkitkan 30 Penghuni
  // Kita memiliki 30 nama Indonesia.
  // 25 penghuni pertama berstatus aktif (tanggalKeluar: null) dan menempati kamar indeks 0 s/d 24.
  // 5 penghuni terakhir (indeks 25 s/d 29) berstatus keluar (tanggalKeluar diisi) dan dikaitkan ke salah satu kamar.
  const entryDates = [
    "2024-01-15T00:00:00.000Z", "2024-02-10T00:00:00.000Z", "2024-03-05T00:00:00.000Z",
    "2024-04-20T00:00:00.000Z", "2024-05-15T00:00:00.000Z", "2024-06-12T00:00:00.000Z",
    "2024-07-08T00:00:00.000Z", "2024-08-22T00:00:00.000Z", "2024-09-18T00:00:00.000Z",
    "2024-10-05T00:00:00.000Z", "2024-11-25T00:00:00.000Z", "2024-12-14T00:00:00.000Z",
    "2025-01-10T00:00:00.000Z", "2025-02-18T00:00:00.000Z", "2025-03-24T00:00:00.000Z",
    "2025-04-05T00:00:00.000Z", "2025-05-12T00:00:00.000Z", "2025-06-20T00:00:00.000Z",
    "2025-07-15T00:00:00.000Z", "2025-08-08T00:00:00.000Z", "2025-09-30T00:00:00.000Z",
    "2025-10-14T00:00:00.000Z", "2025-11-05T00:00:00.000Z", "2025-12-25T00:00:00.000Z",
    "2026-01-15T00:00:00.000Z", "2026-02-10T00:00:00.000Z", "2026-03-01T00:00:00.000Z",
    "2026-04-01T00:00:00.000Z", "2026-05-01T00:00:00.000Z", "2026-06-01T00:00:00.000Z"
  ];

  for (let i = 0; i < 30; i++) {
    const id = (i + 1).toString();
    const nama = INDONESIAN_NAMES[i];
    const nik = `32010101010100${(i + 1).toString().padStart(2, '0')}`;
    const noTelepon = `0812345678${(i + 1).toString().padStart(2, '0')}`;
    const email = `${nama.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    
    // Alokasi kamar:
    // 25 penghuni pertama menempati kamar aktif (indeks i)
    // 5 penghuni terakhir yang sudah keluar dipetakan ke kamar semula (misalnya kamar 1 s/d 5)
    const kamarId = i < 25 ? kamar[i].id : kamar[i - 25].id;
    
    const tanggalMasuk = entryDates[i];
    let tanggalKeluar: string | null = null;
    
    // Penghuni yang berstatus keluar (indeks 25 s/d 29)
    if (i >= 25) {
      const checkin = new Date(tanggalMasuk);
      // Tinggal selama 6 bulan lalu keluar
      const checkout = new Date(checkin.getFullYear(), checkin.getMonth() + 6, checkin.getDate());
      tanggalKeluar = checkout.toISOString();
    }

    penghuni.push({
      id,
      nama,
      nik,
      noTelepon,
      email,
      kamarId,
      tanggalMasuk,
      tanggalKeluar,
      createdAt: tanggalMasuk,
    });
  }

  // 3. Bangkitkan Riwayat Pembayaran Historis
  // Untuk setiap penghuni, buat catatan tagihan bulanan mulai dari 1 bulan setelah tanggal masuk
  // hingga Juli 2026 (target akhir simulasi).
  const targetEndYear = 2026;
  const targetEndMonth = 6; // Juli (0-indexed)

  penghuni.forEach(p => {
    const assignedRoom = kamar.find(k => k.id === p.kamarId);
    if (!assignedRoom) return;

    const masukDate = new Date(p.tanggalMasuk);
    const checkoutDate = p.tanggalKeluar ? new Date(p.tanggalKeluar) : null;
    
    // Mulai bangkitkan tagihan bulanan semenjak 1 bulan setelah masuk kost
    let currDate = new Date(masukDate.getFullYear(), masukDate.getMonth() + 1, 1);
    
    while (true) {
      const currYear = currDate.getFullYear();
      const currMonthIdx = currDate.getMonth();

      // Berhenti jika sudah melampaui tanggal target akhir
      if (currYear > targetEndYear || (currYear === targetEndYear && currMonthIdx > targetEndMonth)) {
        break;
      }

      // Berhenti jika tanggal tagihan adalah setelah penghuni tersebut keluar/checkout
      if (checkoutDate && currDate > checkoutDate) {
        break;
      }

      const bulan = NAMA_BULAN[currMonthIdx];
      const tahun = currYear;
      const jumlah = assignedRoom.hargaPerBulan;
      
      // Penentuan status bayar secara acak untuk variasi data:
      // Untuk tagihan sebelum Juni 2026 (historis):
      // - 85% lunas dengan tanggal bayar acak
      // - 10% belum_bayar
      // - 5% terlambat
      // Untuk tagihan Juni/Juli 2026 (terbaru):
      // - 50% lunas, 50% belum_bayar
      let status: StatusPembayaran = "lunas";
      const isRecent = currYear === 2026 && currMonthIdx >= 5;
      
      if (isRecent) {
        status = Math.random() > 0.5 ? "lunas" : "belum_bayar";
      } else {
        const rand = Math.random();
        if (rand < 0.85) {
          status = "lunas";
        } else if (rand < 0.95) {
          status = "belum_bayar";
        } else {
          status = "terlambat";
        }
      }

      let tanggalBayar: string | null = null;
      if (status === "lunas") {
        // Dibayar antara tanggal 1 s/d 10 di bulan tersebut
        const payDay = Math.floor(Math.random() * 10) + 1;
        const payDate = new Date(currYear, currMonthIdx, payDay);
        tanggalBayar = payDate.toISOString();
      }

      pembayaran.push({
        id: `${p.id}_${currYear}_${currMonthIdx + 1}`,
        penghuniId: p.id,
        kamarId: assignedRoom.id,
        bulan,
        tahun,
        jumlah,
        tanggalBayar,
        status,
        createdAt: new Date(currYear, currMonthIdx, 1).toISOString(),
      });

      currDate.setMonth(currDate.getMonth() + 1);
    }
  });

  return { kamar, penghuni, pembayaran };
}

// Membaca database lokal dari file JSON
export const bacaDb = (): DbSchema => {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialDb = buatDbDefault();
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf8');
      return initialDb;
    }
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error("Kesalahan membaca file database", e);
    return { kamar: [], penghuni: [], pembayaran: [] };
  }
};

// Menulis pembaruan data ke database lokal (file JSON)
export const tulisDb = (data: DbSchema) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error("Kesalahan menulis file database", e);
  }
};
