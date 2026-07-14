import { NextResponse } from 'next/server';
import { bacaDb, tulisDb } from '@/lib/db';

// Mengambil data penghuni berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = bacaDb();
    const penghuni = db.penghuni.find(p => p.id === id);
    if (!penghuni) {
      return NextResponse.json({ message: 'Penghuni tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(penghuni);
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}

// Memperbarui data penghuni berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = bacaDb();
    
    const index = db.penghuni.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Penghuni tidak ditemukan' }, { status: 404 });
    }
    
    const oldKamarId = db.penghuni[index].kamarId;
    db.penghuni[index] = { ...db.penghuni[index], ...body };
    const newKamarId = db.penghuni[index].kamarId;
    const isCheckedOut = db.penghuni[index].tanggalKeluar !== null;
    
    // Perbarui status kamar tergantung pada proses check-in atau checkout
    if (isCheckedOut) {
      // Kosongkan kamar
      const kIndex = db.kamar.findIndex(k => k.id === newKamarId);
      if (kIndex !== -1) {
        db.kamar[kIndex].status = 'tersedia';
      }
    } else if (oldKamarId !== newKamarId) {
      // Kamar berubah: kosongkan kamar lama dan isi kamar baru
      const oldKIndex = db.kamar.findIndex(k => k.id === oldKamarId);
      if (oldKIndex !== -1) {
        db.kamar[oldKIndex].status = 'tersedia';
      }
      const newKIndex = db.kamar.findIndex(k => k.id === newKamarId);
      if (newKIndex !== -1) {
        db.kamar[newKIndex].status = 'terisi';
      }
    }
    
    tulisDb(db);
    return NextResponse.json(db.penghuni[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Permintaan Tidak Valid' }, { status: 400 });
  }
}

// Hapus data penghuni beserta riwayat pembayarannya berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = bacaDb();
    
    const index = db.penghuni.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Penghuni tidak ditemukan' }, { status: 404 });
    }
    
    const kamarId = db.penghuni[index].kamarId;
    
    // Hapus penghuni
    db.penghuni = db.penghuni.filter(p => p.id !== id);
    
    // Hapus pembayaran (cascade delete)
    db.pembayaran = db.pembayaran.filter(p => p.penghuniId !== id);
    
    // Kosongkan kamar
    const kIndex = db.kamar.findIndex(k => k.id === kamarId);
    if (kIndex !== -1) {
      db.kamar[kIndex].status = 'tersedia';
    }
    
    tulisDb(db);
    return NextResponse.json({ message: 'Penghuni dan riwayat pembayaran berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}
