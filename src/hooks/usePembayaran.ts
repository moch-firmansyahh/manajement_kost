import { useState, useEffect, useCallback } from 'react';
import { Pembayaran } from '@/types';

// Custom hook untuk operasi CRUD Pembayaran Sewa Kost
export const usePembayaran = () => {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data seluruh tagihan pembayaran dari API
  const ambilPembayaran = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Jalankan sinkronisasi / pembuatan tagihan otomatis di server
      await fetch('/api/pembayaran/generate', { method: 'POST' });
      
      // 2. Ambil data tagihan terupdate
      const response = await fetch('/api/pembayaran');
      if (!response.ok) {
        throw new Error('Gagal mengambil data pembayaran');
      }
      const data = await response.json();
      setDataPembayaran(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilPembayaran();
  }, [ambilPembayaran]);

  // Mencari data pembayaran berdasarkan ID
  const ambilPembayaranSesuaiId = (id: string) => dataPembayaran.find(p => p.id === id);

  // Menambah catatan pembayaran baru
  const tambahPembayaran = async (pembayaran: Omit<Pembayaran, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/pembayaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pembayaran),
      });
      if (!response.ok) {
        throw new Error('Gagal menambah data pembayaran');
      }
      await ambilPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  // Memperbarui catatan pembayaran berdasarkan ID
  const perbaruiPembayaran = async (id: string, updatedData: Partial<Pembayaran>) => {
    try {
      const response = await fetch(`/api/pembayaran/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui data pembayaran');
      }
      await ambilPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  // Menghapus catatan pembayaran berdasarkan ID
  const hapusPembayaran = async (id: string) => {
    try {
      const response = await fetch(`/api/pembayaran/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus data pembayaran');
      }
      await ambilPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  // Menghapus catatan pembayaran berdasarkan ID Penghuni
  const hapusPembayaranSesuaiIdPenghuni = async (penghuniId: string) => {
    try {
      const related = dataPembayaran.filter(p => p.penghuniId === penghuniId);
      await Promise.all(related.map(p => fetch(`/api/pembayaran/${p.id}`, { method: 'DELETE' })));
      await ambilPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    dataPembayaran,
    isLoading,
    error,
    ambilPembayaranSesuaiId,
    tambahPembayaran,
    perbaruiPembayaran,
    hapusPembayaran,
    hapusPembayaranSesuaiIdPenghuni,
    refresh: ambilPembayaran,
  };
};
