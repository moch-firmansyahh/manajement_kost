import { useState, useEffect, useCallback } from 'react';
import { Kamar } from '@/types';

// Cache global di level modul
let cacheKamar: Kamar[] = [];
let isKamarLoaded = false;
let kamarActiveFetch: Promise<Kamar[]> | null = null;
const listeners = new Set<(data: Kamar[]) => void>();

// Custom hook untuk operasi CRUD Kamar Kost
export const useKamar = () => {
  const [dataKamar, setDataKamar] = useState<Kamar[]>(cacheKamar);
  const [isLoading, setIsLoading] = useState(!isKamarLoaded);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data kamar dari API
  const ambilKamar = useCallback(async (force = false) => {
    if (isKamarLoaded && !force) {
      setDataKamar(cacheKamar);
      setIsLoading(false);
      return;
    }

    if (kamarActiveFetch) {
      try {
        const data = await kamarActiveFetch;
        setDataKamar(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    kamarActiveFetch = (async () => {
      const response = await fetch('/api/kamar');
      if (!response.ok) {
        throw new Error('Gagal mengambil data kamar');
      }
      const data = await response.json();
      cacheKamar = data;
      isKamarLoaded = true;
      return data;
    })();

    try {
      const data = await kamarActiveFetch;
      setDataKamar(data);
      listeners.forEach(listener => listener(data));
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      kamarActiveFetch = null;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = (newData: Kamar[]) => {
      setDataKamar(newData);
    };
    listeners.add(handleUpdate);
    ambilKamar();
    return () => {
      listeners.delete(handleUpdate);
    };
  }, [ambilKamar]);

  // Mencari data kamar sesuai ID
  const ambilKamarSesuaiId = (id: string) => dataKamar.find(k => k.id === id);

  // Menambah data kamar baru
  const tambahKamar = async (kamar: Omit<Kamar, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/kamar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kamar),
      });
      if (!response.ok) {
        throw new Error('Gagal menambah kamar');
      }
      isKamarLoaded = false;
      await ambilKamar(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Memperbarui data kamar berdasarkan ID
  const perbaruiKamar = async (id: string, updatedData: Partial<Kamar>) => {
    try {
      const response = await fetch(`/api/kamar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui kamar');
      }
      isKamarLoaded = false;
      await ambilKamar(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Menghapus data kamar berdasarkan ID
  const hapusKamar = async (id: string) => {
    try {
      const response = await fetch(`/api/kamar/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus kamar');
      }
      isKamarLoaded = false;
      await ambilKamar(true);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    dataKamar,
    isLoading,
    error,
    ambilKamarSesuaiId,
    tambahKamar,
    perbaruiKamar,
    hapusKamar,
    refresh: () => ambilKamar(true),
  };
};
