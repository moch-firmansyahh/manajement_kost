<div align="center">
  <img src="public/Logo-Kost.png" alt="Logo Kontrakan Pa Iman" width="280" />

  # Manajemen Kost - Kontrakan Pa Iman

  Aplikasi web berbasis Next.js untuk pengelola/pemilik kost dalam memantau kamar, data penghuni, serta pencatatan tagihan sewa bulanan secara digital.
</div>

---

## 🧑‍💻 Author

**Moch Firmansyah** - *103012400137* - IF-48-08 - Telkom University

## 🚀 Fitur Utama

- **Dashboard Statistik**: Memantau total kamar, kamar kosong atau terisi, serta akumulasi pendapatan sewa secara real-time.
- **Manajemen Kamar (CRUD)**: Pendataan nomor kamar, lantai, tipe, harga per bulan, fasilitas kustom, dan status kesiapan kamar.
- **Manajemen Penghuni (CRUD)**: Registrasi data NIK, nomor telepon, tanggal masuk, status keaktifan, dan riwayat kamar yang pernah disewa.
- **Sistem Billing Pembayaran**: Auto-generation tagihan bulanan berjalan, pencatatan transaksi masuk, filter tahun/status bayar, serta pencarian instan nama penyewa.
- **Route Transitions & HouseLoader**: Pengalaman animasi gambar garis rumah SVG premium saat awal masuk aplikasi, memuat dashboard, dan perpindahan rute inti.
- **Lightweight Hooks Caching**: Optimasi kinerja frontend menggunakan module-level cache & event listeners pada hooks (`useKamar`, `usePenghuni`, `usePembayaran`) untuk mengeliminasi duplikasi request API dan lag secara total.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Library**: [ShadcnUI](https://ui.shadcn.com/)
- **Data Store**: Local State & API Route Handlers (Persistensi file `db.json` dengan programmatic seeding data awal)

---

## 📂 Struktur Folder Proyek

```
manajemen-kost/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout dengan sidebar & transisi rute
│   │   ├── page.tsx                # Halaman dashboard utama
│   │   ├── loading.tsx             # Penanganan status loading Next.js
│   │   ├── error.tsx               # Batasan kesalahan runtime
│   │   ├── not-found.tsx           # Halaman 404 kustom
│   │   ├── kamar/                  # Halaman daftar & detail kamar ([id])
│   │   ├── penghuni/               # Halaman daftar & detail penghuni ([id])
│   │   ├── pembayaran/             # Halaman daftar & detail pembayaran ([id])
│   │   └── api/                    # Route Handlers API (kamar, penghuni, pembayaran)
│   ├── components/
│   │   ├── ui/                     # Komponen primitif ShadcnUI
│   │   ├── layout/                 # Sidebar.tsx & Navbar.tsx
│   │   ├── kamar/                  # KamarTable.tsx & KamarForm.tsx
│   │   ├── penghuni/               # PenghuniTable.tsx & PenghuniForm.tsx
│   │   └── pembayaran/             # PembayaranTable.tsx & PembayaranForm.tsx
│   ├── hooks/
│   │   ├── useKamar.ts             # Custom hook kamar + cache level modul
│   │   ├── usePenghuni.ts          # Custom hook penghuni + cache level modul
│   │   └── usePembayaran.ts        # Custom hook pembayaran + cache level modul
│   └── types/
│       └── index.ts                # Definisi interface TypeScript global
```

---

## ⚡ Cara Menjalankan Proyek

### Prasyarat (Prerequisites)
- Node.js versi 18 ke atas
- npm atau yarn

### Instalasi & Menjalankan Local Server

1. **Clone repository ini**:
   ```bash
   git clone https://github.com/moch-firmansyahh/manajement_kost.git
   ```

2. **Masuk ke direktori proyek**:
   ```bash
   cd manajement_kost
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```
---
