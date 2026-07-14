import { NextResponse } from 'next/server';
import { bacaDb, tulisDb } from '@/lib/db';

// Mengambil data kamar berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = bacaDb();
    const kamar = db.kamar.find(k => k.id === id);
    if (!kamar) {
      return NextResponse.json({ message: 'Kamar tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(kamar);
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}

// Memperbarui data kamar berdasarkan ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = bacaDb();
    
    const index = db.kamar.findIndex(k => k.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Kamar tidak ditemukan' }, { status: 404 });
    }
    
    db.kamar[index] = { ...db.kamar[index], ...body };
    tulisDb(db);
    
    return NextResponse.json(db.kamar[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Permintaan Tidak Valid' }, { status: 400 });
  }
}

// Hapus data kamar berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = bacaDb();
    
    const index = db.kamar.findIndex(k => k.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Kamar tidak ditemukan' }, { status: 404 });
    }
    
    db.kamar = db.kamar.filter(k => k.id !== id);
    tulisDb(db);
    
    return NextResponse.json({ message: 'Kamar berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}
