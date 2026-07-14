import { useState, useEffect, useCallback } from 'react';
import { Penghuni } from '@/types';

export const usePenghuni = () => {
  const [dataPenghuni, setDataPenghuni] = useState<Penghuni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPenghuni = useCallback(async () => {
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
    fetchPenghuni();
  }, [fetchPenghuni]);

  const getPenghuniById = (id: string) => dataPenghuni.find(p => p.id === id);

  const addPenghuni = async (penghuni: Omit<Penghuni, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/penghuni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(penghuni),
      });
      if (!response.ok) {
        throw new Error('Gagal menambah penghuni');
      }
      await fetchPenghuni();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePenghuni = async (id: string, updatedData: Partial<Penghuni>) => {
    try {
      const response = await fetch(`/api/penghuni/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui penghuni');
      }
      await fetchPenghuni();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePenghuni = async (id: string) => {
    try {
      const response = await fetch(`/api/penghuni/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus penghuni');
      }
      await fetchPenghuni();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    dataPenghuni,
    isLoading,
    error,
    getPenghuniById,
    addPenghuni,
    updatePenghuni,
    deletePenghuni,
    refresh: fetchPenghuni,
  };
};
