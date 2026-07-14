import { useState, useEffect, useCallback } from 'react';
import { Kamar } from '@/types';

export const useKamar = () => {
  const [dataKamar, setDataKamar] = useState<Kamar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKamar = useCallback(async () => {
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
    fetchKamar();
  }, [fetchKamar]);

  const getKamarById = (id: string) => dataKamar.find(k => k.id === id);

  const addKamar = async (kamar: Omit<Kamar, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/kamar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kamar),
      });
      if (!response.ok) {
        throw new Error('Gagal menambah kamar');
      }
      await fetchKamar();
    } catch (err) {
      console.error(err);
    }
  };

  const updateKamar = async (id: string, updatedData: Partial<Kamar>) => {
    try {
      const response = await fetch(`/api/kamar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui kamar');
      }
      await fetchKamar();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteKamar = async (id: string) => {
    try {
      const response = await fetch(`/api/kamar/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus kamar');
      }
      await fetchKamar();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    dataKamar,
    isLoading,
    error,
    getKamarById,
    addKamar,
    updateKamar,
    deleteKamar,
    refresh: fetchKamar,
  };
};
