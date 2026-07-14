import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const pembayaran = db.pembayaran.find(p => p.id === id);
    if (!pembayaran) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }
    return NextResponse.json(pembayaran);
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
    
    const index = db.pembayaran.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }
    
    db.pembayaran[index] = { ...db.pembayaran[index], ...body };
    writeDb(db);
    
    return NextResponse.json(db.pembayaran[index]);
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
    
    const index = db.pembayaran.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }
    
    db.pembayaran = db.pembayaran.filter(p => p.id !== id);
    writeDb(db);
    
    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
