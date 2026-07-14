import { NextResponse } from 'next/server';
import { bacaDb, tulisDb } from '@/lib/db';

// Mengambil data pembayaran berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = bacaDb();
    const pembayaran = db.pembayaran.find(p => p.id === id);
    if (!pembayaran) {
      return NextResponse.json({ message: 'Pembayaran tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(pembayaran);
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}

// Memperbarui data pembayaran berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = bacaDb();
    
    const index = db.pembayaran.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Pembayaran tidak ditemukan' }, { status: 404 });
    }
    
    db.pembayaran[index] = { ...db.pembayaran[index], ...body };
    tulisDb(db);
    
    return NextResponse.json(db.pembayaran[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Permintaan Tidak Valid' }, { status: 400 });
  }
}

// Menghapus data pembayaran berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = bacaDb();
    
    const index = db.pembayaran.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Pembayaran tidak ditemukan' }, { status: 404 });
    }
    
    db.pembayaran = db.pembayaran.filter(p => p.id !== id);
    tulisDb(db);
    
    return NextResponse.json({ message: 'Pembayaran berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}
