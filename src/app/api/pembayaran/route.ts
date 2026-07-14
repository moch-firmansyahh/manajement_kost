import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Pembayaran } from '@/types';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.pembayaran);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    
    const newPembayaran: Pembayaran = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    db.pembayaran.push(newPembayaran);
    writeDb(db);
    
    return NextResponse.json(newPembayaran, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }
}
