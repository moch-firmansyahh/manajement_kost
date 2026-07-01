## Konteks Project

Aplikasi web manajemen kost berbasis Next.js untuk pemilik kost dalam mengelola kamar, penghuni, dan pembayaran sewa bulanan secara digital.

**Tugas Besar:** CCI Frontend Web Development 2026
**Deadline:** 15 Juli 2026
**Sifat:** Individu

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Library:** ShadcnUI
- **Data:** Local state dengan useState dan useEffect (tidak menggunakan database eksternal)

---

## Aturan Coding yang Wajib Diikuti

### Umum

- Selalu gunakan TypeScript, tidak boleh ada file `.js` di dalam `src/`
- Semua komponen menggunakan functional component dengan arrow function
- Tidak boleh menggunakan `any` sebagai tipe data
- Selalu definisikan tipe/interface di `src/types/index.ts`
- Gunakan named export untuk komponen, bukan default export kecuali untuk halaman di `app/`

### Penamaan

- Komponen: PascalCase (contoh: `KamarCard.tsx`)
- Hooks: camelCase dengan prefix `use` (contoh: `useKamar.ts`)
- Fungsi: camelCase (contoh: `handleDelete`)
- Variabel: camelCase (contoh: `dataKamar`)
- Konstanta global: UPPER_SNAKE_CASE (contoh: `STATUS_PEMBAYARAN`)
- File halaman di app/: selalu `page.tsx`

### Struktur Komponen

Urutan penulisan di dalam setiap komponen harus konsisten:

1. Import
2. Definisi tipe props (jika ada)
3. Deklarasi komponen
4. Deklarasi state
5. Deklarasi hooks
6. Fungsi handler
7. Return JSX

### Styling

- Selalu gunakan Tailwind CSS untuk styling
- Tidak boleh menggunakan inline style kecuali untuk nilai dinamis yang tidak bisa di-handle Tailwind
- Gunakan komponen ShadcnUI untuk elemen UI (Button, Input, Table, Dialog, Badge, Card)
- Responsive wajib ada di setiap halaman dengan breakpoint: `sm:`, `md:`, `lg:`

---

## Struktur Folder

```
src/
├── app/
│   ├── layout.tsx              # Root layout dengan Sidebar
│   ├── page.tsx                # Halaman dashboard
│   ├── kamar/
│   │   ├── page.tsx            # Daftar semua kamar
│   │   └── [id]/
│   │       └── page.tsx        # Detail kamar
│   ├── penghuni/
│   │   ├── page.tsx            # Daftar semua penghuni
│   │   └── [id]/
│   │       └── page.tsx        # Detail penghuni
│   └── pembayaran/
│       ├── page.tsx            # Daftar semua pembayaran
│       └── [id]/
│           └── page.tsx        # Detail pembayaran
├── components/
│   ├── ui/                     # Komponen ShadcnUI (auto-generated)
│   ├── layout/
│   │   ├── Sidebar.tsx         # Navigasi sidebar
│   │   └── Navbar.tsx          # Header navbar
│   ├── dashboard/
│   │   └── StatCard.tsx        # Card statistik dashboard
│   ├── kamar/
│   │   ├── KamarTable.tsx      # Tabel daftar kamar
│   │   ├── KamarForm.tsx       # Form tambah/edit kamar
│   │   └── KamarBadge.tsx      # Badge status kamar
│   ├── penghuni/
│   │   ├── PenghuniTable.tsx   # Tabel daftar penghuni
│   │   ├── PenghuniForm.tsx    # Form tambah/edit penghuni
│   │   └── PenghuniCard.tsx    # Card detail penghuni
│   └── pembayaran/
│       ├── PembayaranTable.tsx # Tabel daftar pembayaran
│       ├── PembayaranForm.tsx  # Form tambah/edit pembayaran
│       └── StatusBadge.tsx     # Badge status pembayaran
├── hooks/
│   ├── useKamar.ts             # Custom hook untuk CRUD kamar
│   ├── usePenghuni.ts          # Custom hook untuk CRUD penghuni
│   └── usePembayaran.ts        # Custom hook untuk CRUD pembayaran
├── lib/
│   └── utils.ts                # Fungsi helper (cn, format tanggal, format rupiah)
└── types/
    └── index.ts                # Semua definisi tipe dan interface
```

---

## Definisi Tipe Data

Semua tipe berikut harus ada di `src/types/index.ts`:

```typescript
export type StatusKamar = "tersedia" | "terisi" | "maintenance";

export type StatusPembayaran = "lunas" | "belum_bayar" | "terlambat";

export interface Kamar {
  id: string;
  nomorKamar: string;
  lantai: number;
  tipe: string;
  hargaPerBulan: number;
  fasilitas: string[];
  status: StatusKamar;
  createdAt: string;
}

export interface Penghuni {
  id: string;
  nama: string;
  nik: string;
  noTelepon: string;
  email: string;
  kamarId: string;
  tanggalMasuk: string;
  tanggalKeluar: string | null;
  createdAt: string;
}

export interface Pembayaran {
  id: string;
  penghuniId: string;
  kamarId: string;
  bulan: string;
  tahun: number;
  jumlah: number;
  tanggalBayar: string | null;
  status: StatusPembayaran;
  createdAt: string;
}
```

---

## Data Dummy

Gunakan data dummy lokal di masing-masing custom hook menggunakan `useState`. Tidak perlu database atau API eksternal. Data disimpan di state selama sesi berlangsung.

Contoh struktur data dummy untuk kamar:

```typescript
const DUMMY_KAMAR: Kamar[] = [
  {
    id: "1",
    nomorKamar: "101",
    lantai: 1,
    tipe: "Standard",
    hargaPerBulan: 800000,
    fasilitas: ["AC", "WiFi", "Kamar Mandi Dalam"],
    status: "terisi",
    createdAt: "2024-01-01",
  },
];
```

---

## Halaman dan Fitur per Halaman

### Dashboard (`/`)

- Menampilkan 4 stat card: total kamar, kamar terisi, kamar kosong, pendapatan bulan ini
- Menampilkan tabel penghuni terbaru
- Menampilkan tabel pembayaran yang belum lunas

### Kamar (`/kamar`)

- Tabel daftar semua kamar dengan kolom: nomor kamar, tipe, harga, status, aksi
- Tombol tambah kamar (buka dialog form)
- Filter berdasarkan status kamar
- Aksi: lihat detail, edit, hapus

### Detail Kamar (`/kamar/[id]`)

- Informasi lengkap kamar
- Daftar penghuni yang pernah menempati kamar tersebut
- Riwayat pembayaran kamar tersebut

### Penghuni (`/penghuni`)

- Tabel daftar semua penghuni dengan kolom: nama, nomor kamar, tanggal masuk, status, aksi
- Tombol tambah penghuni (buka dialog form)
- Fitur pencarian berdasarkan nama
- Aksi: lihat detail, edit, hapus

### Detail Penghuni (`/penghuni/[id]`)

- Informasi lengkap penghuni
- Informasi kamar yang ditempati
- Riwayat pembayaran penghuni tersebut

### Pembayaran (`/pembayaran`)

- Tabel daftar semua pembayaran dengan kolom: nama penghuni, kamar, bulan, jumlah, status, aksi
- Tombol tambah pembayaran (buka dialog form)
- Filter berdasarkan status pembayaran
- Aksi: lihat detail, edit, hapus

---

## Kriteria Penilaian yang Harus Dicover

| Kriteria                  | Cara Implementasi                                                      |
| ------------------------- | ---------------------------------------------------------------------- |
| TailwindCSS & Responsive  | Semua halaman responsive dengan breakpoint sm, md, lg                  |
| Component & Hooks         | Komponen reusable di components/, custom hooks di hooks/               |
| Routing & Dynamic Routing | App Router dengan [id] di kamar, penghuni, pembayaran                  |
| Data Fetching             | useEffect untuk load data dari custom hooks                            |
| Conditional Rendering     | Badge status kamar dan pembayaran, tampilan kosong jika data tidak ada |
| TypeScript                | Semua file menggunakan TypeScript dengan tipe yang proper              |
| UI Library                | ShadcnUI untuk semua komponen UI                                       |

---
