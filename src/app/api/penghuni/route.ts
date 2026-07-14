import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Penghuni } from '@/types';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.penghuni);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    
    const newPenghuni: Penghuni = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    db.penghuni.push(newPenghuni);
    
    // Auto-update room status to 'terisi' if room is assigned
    if (newPenghuni.kamarId) {
      const kamarIndex = db.kamar.findIndex(k => k.id === newPenghuni.kamarId);
      if (kamarIndex !== -1) {
        db.kamar[kamarIndex].status = 'terisi';
      }
    }
    
    writeDb(db);
    
    return NextResponse.json(newPenghuni, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }
}
