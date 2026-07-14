import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const penghuni = db.penghuni.find(p => p.id === id);
    if (!penghuni) {
      return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });
    }
    return NextResponse.json(penghuni);
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
    
    const index = db.penghuni.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });
    }
    
    const oldKamarId = db.penghuni[index].kamarId;
    db.penghuni[index] = { ...db.penghuni[index], ...body };
    const newKamarId = db.penghuni[index].kamarId;
    const isCheckedOut = db.penghuni[index].tanggalKeluar !== null;
    
    // Update room status depending on check-in or checkout
    if (isCheckedOut) {
      // Set the room as available
      const kIndex = db.kamar.findIndex(k => k.id === newKamarId);
      if (kIndex !== -1) {
        db.kamar[kIndex].status = 'tersedia';
      }
    } else if (oldKamarId !== newKamarId) {
      // Room changed: make old room available and new room occupied
      const oldKIndex = db.kamar.findIndex(k => k.id === oldKamarId);
      if (oldKIndex !== -1) {
        db.kamar[oldKIndex].status = 'tersedia';
      }
      const newKIndex = db.kamar.findIndex(k => k.id === newKamarId);
      if (newKIndex !== -1) {
        db.kamar[newKIndex].status = 'terisi';
      }
    }
    
    writeDb(db);
    return NextResponse.json(db.penghuni[index]);
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
    
    const index = db.penghuni.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });
    }
    
    const kamarId = db.penghuni[index].kamarId;
    
    // Delete tenant
    db.penghuni = db.penghuni.filter(p => p.id !== id);
    
    // Cascade delete payments
    db.pembayaran = db.pembayaran.filter(p => p.penghuniId !== id);
    
    // Free the room
    const kIndex = db.kamar.findIndex(k => k.id === kamarId);
    if (kIndex !== -1) {
      db.kamar[kIndex].status = 'tersedia';
    }
    
    writeDb(db);
    return NextResponse.json({ message: 'Tenant and payments deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
