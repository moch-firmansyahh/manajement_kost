import { useState, useEffect, useCallback } from 'react';
import { Penghuni } from '@/types';

// Cache global di level modul
let cachePenghuni: Penghuni[] = [];
let isPenghuniLoaded = false;
let penghuniActiveFetch: Promise<Penghuni[]> | null = null;
const listeners = new Set<(data: Penghuni[]) => void>();

// Custom hook untuk operasi CRUD Penghuni Kost
export const usePenghuni = () => {
  const [dataPenghuni, setDataPenghuni] = useState<Penghuni[]>(cachePenghuni);
  const [isLoading, setIsLoading] = useState(!isPenghuniLoaded);
  const [error, setError] = useState<string | null>(null);

  // Mengambil data seluruh penghuni dari API
  const ambilPenghuni = useCallback(async (force = false) => {
    if (isPenghuniLoaded && !force) {
      setDataPenghuni(cachePenghuni);
      setIsLoading(false);
      return;
    }

    if (penghuniActiveFetch) {
      try {
        const data = await penghuniActiveFetch;
        setDataPenghuni(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    penghuniActiveFetch = (async () => {
      const response = await fetch('/api/penghuni');
      if (!response.ok) {
        throw new Error('Gagal mengambil data penghuni');
      }
      const data = await response.json();
      cachePenghuni = data;
      isPenghuniLoaded = true;
      return data;
    })();

    try {
      const data = await penghuniActiveFetch;
      setDataPenghuni(data);
      listeners.forEach(listener => listener(data));
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      penghuniActiveFetch = null;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = (newData: Penghuni[]) => {
      setDataPenghuni(newData);
    };
    listeners.add(handleUpdate);
    ambilPenghuni();
    return () => {
      listeners.delete(handleUpdate);
    };
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
      isPenghuniLoaded = false;
      await ambilPenghuni(true);
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
      isPenghuniLoaded = false;
      await ambilPenghuni(true);
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
      isPenghuniLoaded = false;
      await ambilPenghuni(true);
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
    refresh: () => ambilPenghuni(true),
  };
};
