import { NextResponse } from 'next/server';
import { bacaDb, tulisDb } from '@/lib/db';
import { Penghuni } from '@/types';

// Mengambil seluruh data penghuni
export async function GET() {
  try {
    const db = bacaDb();
    return NextResponse.json(db.penghuni);
  } catch (error) {
    return NextResponse.json({ message: 'Kesalahan Server Internal' }, { status: 500 });
  }
}

// Menambahkan data penghuni baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = bacaDb();
    
    const newPenghuni: Penghuni = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    db.penghuni.push(newPenghuni);
    
    // Otomatis ubah status kamar menjadi 'terisi' jika dikaitkan ke kamar tertentu
    if (newPenghuni.kamarId) {
      const kamarIndex = db.kamar.findIndex(k => k.id === newPenghuni.kamarId);
      if (kamarIndex !== -1) {
        db.kamar[kamarIndex].status = 'terisi';
      }
    }
    
    tulisDb(db);
    
    return NextResponse.json(newPenghuni, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Permintaan Tidak Valid' }, { status: 400 });
  }
}
