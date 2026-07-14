import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const kamar = db.kamar.find(k => k.id === id);
    if (!kamar) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(kamar);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = readDb();
    
    const index = db.kamar.findIndex(k => k.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    
    db.kamar[index] = { ...db.kamar[index], ...body };
    writeDb(db);
    
    return NextResponse.json(db.kamar[index]);
  } catch (error) {
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    
    const index = db.kamar.findIndex(k => k.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Room not found' }, { status: 404 });
    }
    
    db.kamar = db.kamar.filter(k => k.id !== id);
    writeDb(db);
    
    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
