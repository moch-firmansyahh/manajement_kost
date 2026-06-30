import { useState, useEffect } from 'react';
import { Pembayaran } from '@/types';

const DUMMY_PEMBAYARAN: Pembayaran[] = [
  {
    id: "1",
    penghuniId: "1",
    kamarId: "1",
    bulan: "Januari",
    tahun: 2024,
    jumlah: 800000,
    tanggalBayar: "2024-01-15T10:00:00.000Z",
    status: "lunas",
    createdAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    penghuniId: "1",
    kamarId: "1",
    bulan: "Februari",
    tahun: 2024,
    jumlah: 800000,
    tanggalBayar: null,
    status: "belum_bayar",
    createdAt: "2024-02-01T00:00:00.000Z",
  }
];

let globalDataPembayaran = [...DUMMY_PEMBAYARAN];
let listeners: React.Dispatch<React.SetStateAction<Pembayaran[]>>[] = [];

const notifyListeners = (data: Pembayaran[]) => {
  globalDataPembayaran = data;
  listeners.forEach(listener => listener(data));
};

export const usePembayaran = () => {
  const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>(globalDataPembayaran);

  useEffect(() => {
    listeners.push(setDataPembayaran);
    return () => {
      listeners = listeners.filter(l => l !== setDataPembayaran);
    };
  }, []);

  const getPembayaranById = (id: string) => globalDataPembayaran.find(p => p.id === id);

  const addPembayaran = (pembayaran: Omit<Pembayaran, 'id' | 'createdAt'>) => {
    const newPembayaran: Pembayaran = {
      ...pembayaran,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    notifyListeners([...globalDataPembayaran, newPembayaran]);
  };

  const updatePembayaran = (id: string, updatedData: Partial<Pembayaran>) => {
    notifyListeners(globalDataPembayaran.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePembayaran = (id: string) => {
    notifyListeners(globalDataPembayaran.filter(p => p.id !== id));
  };

  return {
    dataPembayaran,
    getPembayaranById,
    addPembayaran,
    updatePembayaran,
    deletePembayaran,
  };
};
