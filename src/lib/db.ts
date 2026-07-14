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

function generateDefaultDb(): DbSchema {
  const kamar: Kamar[] = [];
  const penghuni: Penghuni[] = [];
  const pembayaran: Pembayaran[] = [];

  // 1. Generate 30 Rooms
  // Floors 1 to 3, 10 rooms per floor: 101-110, 201-210, 301-310
  for (let floor = 1; floor <= 3; floor++) {
    for (let num = 1; num <= 10; num++) {
      const id = `${floor}${num.toString().padStart(2, '0')}`; // e.g. "101", "210"
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

      // Initial status distribution:
      // First 25 rooms will be set to 'terisi' as we assign active tenants to them.
      // Room index 25-27 (rooms 306, 307, 308) -> 'tersedia'
      // Room index 28-29 (rooms 309, 310) -> 'maintenance'
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

  // 2. Generate 30 Tenants
  // We have 30 Indonesian names.
  // The first 25 tenants are active (tanggalKeluar: null) and occupy rooms index 0-24.
  // The last 5 tenants (index 25-29) are checked out (tanggalKeluar set) and we map their kamarId to a room.
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
    
    // Assign rooms:
    // First 25 tenants get occupied rooms (index i)
    // Last 5 checked-out tenants get a room (e.g. they stayed in rooms 1-5 previously)
    const kamarId = i < 25 ? kamar[i].id : kamar[i - 25].id;
    
    const tanggalMasuk = entryDates[i];
    let tanggalKeluar: string | null = null;
    
    // Checked out tenants (index 25 to 29)
    if (i >= 25) {
      const checkin = new Date(tanggalMasuk);
      // Stayed for exactly 6 months
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

  // 3. Generate Historical Payments
  // For each tenant, generate monthly payments from 1 month after their entry date
  // up to July 2026 (or current date/future). Let's target up to July 2026.
  const targetEndYear = 2026;
  const targetEndMonth = 6; // July (0-indexed)

  penghuni.forEach(p => {
    const assignedRoom = kamar.find(k => k.id === p.kamarId);
    if (!assignedRoom) return;

    const masukDate = new Date(p.tanggalMasuk);
    const checkoutDate = p.tanggalKeluar ? new Date(p.tanggalKeluar) : null;
    
    // Start generating bills starting 1 month after entry date
    let currDate = new Date(masukDate.getFullYear(), masukDate.getMonth() + 1, 1);
    
    while (true) {
      const currYear = currDate.getFullYear();
      const currMonthIdx = currDate.getMonth();

      // Stop if we exceed the target date
      if (currYear > targetEndYear || (currYear === targetEndYear && currMonthIdx > targetEndMonth)) {
        break;
      }

      // Stop if the billing date is after they checked out
      if (checkoutDate && currDate > checkoutDate) {
        break;
      }

      const bulan = NAMA_BULAN[currMonthIdx];
      const tahun = currYear;
      const jumlah = assignedRoom.hargaPerBulan;
      
      // Determine status:
      // For bills before June 2026 (historical):
      // - 85% chance 'lunas' (paid)
      // - 10% chance 'belum_bayar' (unpaid)
      // - 5% chance 'terlambat' (late)
      // For bills in June/July 2026 (recent):
      // - 50% 'lunas', 50% 'belum_bayar'
      let status: StatusPembayaran = "lunas";
      const isRecent = currYear === 2026 && currMonthIdx >= 5; // Juni or Juli 2026
      
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
        // Paid between 1st and 10th of that month
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

export const readDb = (): DbSchema => {
  try {
    if (!fs.existsSync(dbPath)) {
      const initialDb = generateDefaultDb();
      fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2), 'utf8');
      return initialDb;
    }
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading database file", e);
    return { kamar: [], penghuni: [], pembayaran: [] };
  }
};

export const writeDb = (data: DbSchema) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error("Error writing database file", e);
  }
};
