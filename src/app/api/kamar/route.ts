import { NextResponse } from 'next/server';
import { bacaDb, tulisDb } from '@/lib/db';
import { Kamar } from '@/types';

// Mengambil seluruh data kamar
export async function GET() {
  try {
    const db = bacaDb();
    return NextResponse.json(db.kamar);
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}

// Menambahkan data kamar baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = bacaDb();
    
    const newKamar: Kamar = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    db.kamar.push(newKamar);
    tulisDb(db);
    
    return NextResponse.json(newKamar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Permintaan Tidak Valid' }, { status: 400 });
  }
}
