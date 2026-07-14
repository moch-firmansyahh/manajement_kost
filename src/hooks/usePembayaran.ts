import { useState, useEffect, useCallback } from 'react';
import { Pembayaran } from '@/types';

export const usePembayaran = () => {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPembayaran = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Trigger auto-generation on server
      await fetch('/api/pembayaran/generate', { method: 'POST' });
      
      // 2. Fetch the updated payments list
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
    fetchPembayaran();
  }, [fetchPembayaran]);

  const getPembayaranById = (id: string) => dataPembayaran.find(p => p.id === id);

  const addPembayaran = async (pembayaran: Omit<Pembayaran, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/pembayaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pembayaran),
      });
      if (!response.ok) {
        throw new Error('Gagal menambah data pembayaran');
      }
      await fetchPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePembayaran = async (id: string, updatedData: Partial<Pembayaran>) => {
    try {
      const response = await fetch(`/api/pembayaran/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Gagal memperbarui data pembayaran');
      }
      await fetchPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePembayaran = async (id: string) => {
    try {
      const response = await fetch(`/api/pembayaran/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus data pembayaran');
      }
      await fetchPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePembayaranByPenghuniId = async (penghuniId: string) => {
    // This is handled automatically by cascade delete on the server side when deleting a tenant,
    // but we can also trigger individual deletes if needed.
    try {
      const related = dataPembayaran.filter(p => p.penghuniId === penghuniId);
      await Promise.all(related.map(p => fetch(`/api/pembayaran/${p.id}`, { method: 'DELETE' })));
      await fetchPembayaran();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    dataPembayaran,
    isLoading,
    error,
    getPembayaranById,
    addPembayaran,
    updatePembayaran,
    deletePembayaran,
    deletePembayaranByPenghuniId,
    refresh: fetchPembayaran,
  };
};
