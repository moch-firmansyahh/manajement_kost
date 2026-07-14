import { NextResponse } from 'next/server';
import { bacaDb, tulisDb } from '@/lib/db';
import { Pembayaran } from '@/types';

// Mengambil seluruh data pembayaran
export async function GET() {
  try {
    const db = bacaDb();
    return NextResponse.json(db.pembayaran);
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}

// Menambahkan data pembayaran baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = bacaDb();
    
    const newPembayaran: Pembayaran = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    db.pembayaran.push(newPembayaran);
    tulisDb(db);
    
    return NextResponse.json(newPembayaran, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Permintaan Tidak Valid' }, { status: 400 });
  }
}
