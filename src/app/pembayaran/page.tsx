"use client";

import { useState } from "react";
import { usePembayaran } from "@/hooks/usePembayaran";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { PembayaranTable } from "@/components/pembayaran/PembayaranTable";
import { PembayaranForm } from "@/components/pembayaran/PembayaranForm";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Pembayaran, StatusPembayaran } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PembayaranPage() {
  const { dataPembayaran, addPembayaran, updatePembayaran, deletePembayaran } = usePembayaran();
  const { dataPenghuni } = usePenghuni();
  const { dataKamar } = useKamar();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<Pembayaran | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusPembayaran | "semua">("semua");

  const filteredData = filterStatus === "semua" 
    ? dataPembayaran 
    : dataPembayaran.filter(p => p.status === filterStatus);

  const handleEdit = (pembayaran: Pembayaran) => {
    setEditingData(pembayaran);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  const handleSubmit = (data: Omit<Pembayaran, "id" | "createdAt">) => {
    if (editingData) {
      updatePembayaran(editingData.id, data);
    } else {
      addPembayaran(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Pembayaran</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Catat Pembayaran
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-xs">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select 
          value={filterStatus} 
          onValueChange={(value) => setFilterStatus(value as StatusPembayaran | "semua")}
        >
          <SelectTrigger className="bg-background border-border">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value="lunas">Lunas</SelectItem>
            <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
            <SelectItem value="terlambat">Terlambat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PembayaranTable 
        data={filteredData} 
        dataPenghuni={dataPenghuni}
        dataKamar={dataKamar}
        onEdit={handleEdit} 
        onDelete={deletePembayaran} 
      />

      <PembayaranForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingData}
        dataPenghuni={dataPenghuni}
        dataKamar={dataKamar}
      />
    </div>
  );
}
