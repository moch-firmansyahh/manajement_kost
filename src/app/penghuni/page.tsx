"use client";

import { useState } from "react";
import { usePenghuni } from "@/hooks/usePenghuni";
import { useKamar } from "@/hooks/useKamar";
import { PenghuniTable } from "@/components/penghuni/PenghuniTable";
import { PenghuniForm } from "@/components/penghuni/PenghuniForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Penghuni } from "@/types";

export default function PenghuniPage() {
  const { dataPenghuni, addPenghuni, updatePenghuni, deletePenghuni } = usePenghuni();
  const { dataKamar } = useKamar();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState<Penghuni | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = dataPenghuni.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (penghuni: Penghuni) => {
    setEditingData(penghuni);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingData(null);
  };

  const handleSubmit = (data: Omit<Penghuni, "id" | "createdAt">) => {
    if (editingData) {
      updatePenghuni(editingData.id, data);
    } else {
      addPenghuni(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Penghuni</h1>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Penghuni
        </Button>
      </div>

      <div className="flex items-center max-w-sm relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Cari nama penghuni..." 
          className="pl-10 bg-background border-border focus-visible:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <PenghuniTable 
        data={filteredData} 
        dataKamar={dataKamar}
        onEdit={handleEdit} 
        onDelete={deletePenghuni} 
      />

      <PenghuniForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingData}
        dataKamar={dataKamar}
      />
    </div>
  );
}
