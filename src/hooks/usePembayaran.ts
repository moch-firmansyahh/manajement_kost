import { useState, useEffect, useCallback } from 'react';
import { Pembayaran } from '@/types';

// Cache global di level modul
let cachePembayaran: Pembayaran[] = [];
let isPembayaranLoaded = false;
let pembayaranActiveFetch: Promise<Pembayaran[]> | null = null;
const listeners = new Set<(data: Pembayaran[]) => void>();

// Custom hook untuk operasi CRUD Pembayaran Sewa Kost
export const usePembayaran = () => {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>(cachePembayaran);
  const [isLoading, setIsLoading] = useState(!isPembayaranLoaded);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data seluruh tagihan pembayaran dari API
  const ambilPembayaran = useCallback(async (force = false) => {
    if (isPembayaranLoaded && !force) {
      setDataPembayaran(cachePembayaran);
      setIsLoading(false);
      return;
    }

    if (pembayaranActiveFetch) {
      try {
        const data = await pembayaranActiveFetch;
        setDataPembayaran(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    pembayaranActiveFetch = (async () => {
      // 1. Jalankan sinkronisasi / pembuatan tagihan otomatis di server
      await fetch('/api/pembayaran/generate', { method: 'POST' });
      
      // 2. Ambil data tagihan terupdate
      const response = await fetch('/api/pembayaran');
      if (!response.ok) {
        throw new Error('Gagal mengambil data pembayaran');
      }
      const data = await response.json();
      cachePembayaran = data;
      isPembayaranLoaded = true;
      return data;
    })();

    try {
      const data = await pembayaranActiveFetch;
      setDataPembayaran(data);
      listeners.forEach(listener => listener(data));
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      pembayaranActiveFetch = null;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = (newData: Pembayaran[]) => {
      setDataPembayaran(newData);
    };
    listeners.add(handleUpdate);
    ambilPembayaran();
    return () => {
      listeners.delete(handleUpdate);
    };
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
      isPembayaranLoaded = false;
      await ambilPembayaran(true);
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
      isPembayaranLoaded = false;
      await ambilPembayaran(true);
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
      isPembayaranLoaded = false;
      await ambilPembayaran(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Menghapus catatan pembayaran berdasarkan ID Penghuni
  const hapusPembayaranSesuaiIdPenghuni = async (penghuniId: string) => {
    try {
      const related = dataPembayaran.filter(p => p.penghuniId === penghuniId);
      await Promise.all(related.map(p => fetch(`/api/pembayaran/${p.id}`, { method: 'DELETE' })));
      isPembayaranLoaded = false;
      await ambilPembayaran(true);
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
    refresh: () => ambilPembayaran(true),
  };
};
