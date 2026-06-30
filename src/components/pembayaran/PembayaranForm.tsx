"use client";

import { useState, useEffect } from "react";
import { Pembayaran, Penghuni, StatusPembayaran, Kamar } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PembayaranFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Pembayaran, "id" | "createdAt">) => void;
  initialData?: Pembayaran | null;
  dataPenghuni: Penghuni[];
  dataKamar: Kamar[];
}

const BULAN_OPTIONS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DEFAULT_STATE = {
  penghuniId: "",
  kamarId: "",
  bulan: BULAN_OPTIONS[new Date().getMonth()],
  tahun: new Date().getFullYear(),
  jumlah: 0,
  tanggalBayar: null as string | null,
  status: "belum_bayar" as StatusPembayaran,
};

export const PembayaranForm = ({ isOpen, onClose, onSubmit, initialData, dataPenghuni, dataKamar }: PembayaranFormProps) => {
  const [formData, setFormData] = useState(DEFAULT_STATE);

  useEffect(() => {
    if (initialData) {
      setFormData({
        penghuniId: initialData.penghuniId,
        kamarId: initialData.kamarId,
        bulan: initialData.bulan,
        tahun: initialData.tahun,
        jumlah: initialData.jumlah / 1000,
        tanggalBayar: initialData.tanggalBayar ? initialData.tanggalBayar.split('T')[0] : null,
        status: initialData.status,
      });
    } else {
      setFormData(DEFAULT_STATE);
    }
  }, [initialData, isOpen]);

  const handlePenghuniChange = (penghuniId: string) => {
    const penghuni = dataPenghuni.find(p => p.id === penghuniId);
    if (penghuni) {
      const kamar = dataKamar.find(k => k.id === penghuni.kamarId);
      setFormData({
        ...formData,
        penghuniId,
        kamarId: penghuni.kamarId,
        jumlah: kamar ? (kamar.hargaPerBulan / 1000) : 0,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      jumlah: formData.jumlah * 1000,
      tanggalBayar: formData.tanggalBayar ? new Date(formData.tanggalBayar).toISOString() : null,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Pembayaran" : "Tambah Pembayaran"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="penghuniId">Penghuni</Label>
            <Select 
              value={formData.penghuniId} 
              onValueChange={handlePenghuniChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Penghuni" />
              </SelectTrigger>
              <SelectContent>
                {dataPenghuni.map((penghuni) => (
                  <SelectItem key={penghuni.id} value={penghuni.id}>
                    {penghuni.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bulan">Bulan</Label>
              <Select 
                value={formData.bulan} 
                onValueChange={(value) => setFormData({ ...formData, bulan: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {BULAN_OPTIONS.map((bulan) => (
                    <SelectItem key={bulan} value={bulan}>{bulan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                type="number"
                min="2020"
                required
                value={formData.tahun}
                onChange={(e) => setFormData({ ...formData, tahun: parseInt(e.target.value) || new Date().getFullYear() })}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jumlah">Jumlah Tagihan (Ribuan)</Label>
            <div className="relative">
              <Input
                id="jumlah"
                type="number"
                min="0"
                required
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: parseInt(e.target.value) || 0 })}
                onFocus={(e) => e.target.select()}
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                .000
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value as StatusPembayaran })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunas">Lunas</SelectItem>
                <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                <SelectItem value="terlambat">Terlambat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.status === "lunas" && (
            <div className="space-y-2">
              <Label htmlFor="tanggalBayar">Tanggal Bayar</Label>
              <Input
                id="tanggalBayar"
                type="date"
                required
                value={formData.tanggalBayar || ""}
                onChange={(e) => setFormData({ ...formData, tanggalBayar: e.target.value })}
              />
            </div>
          )}

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Simpan</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
