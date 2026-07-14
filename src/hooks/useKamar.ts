import { useState, useEffect, useCallback } from 'react';
import { Kamar } from '@/types';

// Custom hook untuk operasi CRUD Kamar Kost
export const useKamar = () => {
  const [dataKamar, setDataKamar] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data kamar dari API
  const ambilKamar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/kamar');
      if (!response.ok) {
        throw new Error('Gagal mengambil data kamar');
      }
      const data = await response.json();
      setDataKamar(data);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    ambilKamar();
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
      await ambilKamar();
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
      await ambilKamar();
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
      await ambilKamar();
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
    refresh: ambilKamar,
  };
};
