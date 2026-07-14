import { useState, useEffect, useCallback } from 'react';
import { Penghuni } from '@/types';

// Custom hook untuk operasi CRUD Penghuni Kost
export const usePenghuni = () => {
  const [dataPenghuni, setDataPenghuni] = useState<Penghuni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data seluruh penghuni dari API
  const ambilPenghuni = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/penghuni');
      if (!response.ok) {
        throw new Error('Gagal mengambil data penghuni');
      }
      const data = await response.json();
      setDataPenghuni(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilPenghuni();
  }, [ambilPenghuni]);

  // Mencari data penghuni berdasarkan ID
  const ambilPenghuniSesuaiId = (id: string) => dataPenghuni.find(p => p.id === id);

  // Menambah data penghuni baru
  const tambahPenghuni = async (penghuni: Omit<Penghuni, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/penghuni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(penghuni),
      });
      if (!response.ok) {
        throw new Error('Gagal menambah penghuni');
      }
      await ambilPenghuni();
    } catch (err) {
      console.error(err);
    }
  };

  // Memperbarui data penghuni berdasarkan ID
  const perbaruiPenghuni = async (id: string, updatedData: Partial<Penghuni>) => {
    try {
      const response = await fetch(`/api/penghuni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui penghuni');
      }
      await ambilPenghuni();
    } catch (err) {
      console.error(err);
    }
  };

  // Menghapus data penghuni berdasarkan ID
  const hapusPenghuni = async (id: string) => {
    try {
      const response = await fetch(`/api/penghuni/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus penghuni');
      }
      await ambilPenghuni();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    dataPenghuni,
    isLoading,
    error,
    ambilPenghuniSesuaiId,
    tambahPenghuni,
    perbaruiPenghuni,
    hapusPenghuni,
    refresh: ambilPenghuni,
  };
};
