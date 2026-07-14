import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Kamar } from '@/types';

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json(db.kamar);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDb();
    
    const newKamar: Kamar = {
      ...body,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    db.kamar.push(newKamar);
    writeDb(db);
    
    return NextResponse.json(newKamar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }
}
