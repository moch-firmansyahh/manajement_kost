import fs from 'fs';
import path from 'path';
import { Kamar, Penghuni, Pembayaran } from '@/types';

const dbPath = path.join(process.cwd(), 'src/lib/db.json');

export interface DbSchema {
  kamar: Kamar[];
  penghuni: Penghuni[];
  pembayaran: Pembayaran[];
}

const DEFAULT_DB: DbSchema = {
  kamar: [
    {
      id: "1",
      nomorKamar: "101",
      lantai: 1,
      tipe: "Standard",
      hargaPerBulan: 800000,
      fasilitas: ["Kasur", "Lemari", "Kipas Angin", "Kamar Mandi Luar"],
      status: "terisi",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      nomorKamar: "102",
      lantai: 1,
      tipe: "Deluxe",
      hargaPerBulan: 1200000,
      fasilitas: ["Kasur", "Lemari", "AC", "WiFi", "Kamar Mandi Dalam"],
      status: "tersedia",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "3",
      nomorKamar: "201",
      lantai: 2,
      tipe: "VIP",
      hargaPerBulan: 1500000,
      fasilitas: ["Kasur Springbed", "Lemari", "AC", "WiFi", "TV", "Kamar Mandi Dalam", "Water Heater"],
      status: "maintenance",
      createdAt: "2024-01-01T00:00:00.000Z",
    }
  ],
  penghuni: [
    {
      id: "1",
      nama: "Budi Santoso",
      nik: "3201010101010001",
      noTelepon: "081234567890",
      email: "budi@example.com",
      kamarId: "1",
      tanggalMasuk: "2026-03-01T00:00:00.000Z",
      tanggalKeluar: null,
      createdAt: "2026-03-01T00:00:00.000Z",
    }
  ],
  pembayaran: []
};

export const readDb = (): DbSchema => {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading database file", e);
    return DEFAULT_DB;
  }
};

export const writeDb = (data: DbSchema) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error("Error writing database file", e);
  }
};
