// pages/tambah-subkriteria.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllKriteria } from "@/lib/firestore/kriteria";
import { createSubkriteria } from "@/lib/firestore/sub-kriteria";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomAlert from "@/components/ui/CustomAlert";

const TambahSubkriteriaPage = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  const [kriteriaList, setKriteriaList] = useState<IKriteria[]>([]);
  const [selectedKriteria, setSelectedKriteria] = useState<IKriteria | null>(
    null
  );
  const [subkriteria, setSubkriteria] = useState<string>("");
  const [nilaiTarget, setNilaiTarget] = useState<number>(0);
  const [tipe, setTipe] = useState<"Core" | "Secondary">("Core");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKriteria = async () => {
      try {
        const kriteria = await getAllKriteria();
        setKriteriaList(kriteria);
      } catch (error) {
        console.error("Gagal mengambil kriteria", error);
      }
    };

    fetchKriteria();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedKriteria) {
        setAlert({
          type: "warning",
          message: "Kriteria belum dipilih!",
          show: true,
        });
        return;
      }
      const newSubkriteria: ISubKriteriaCreate = {
        kriteriaId: selectedKriteria.id,
        kriteriaKode: selectedKriteria.kode,
        subkriteria,
        nilaiTarget,
        kode: `SK${Date.now()}`, // Bisa menggunakan timestamp sebagai kode unik
        tipe,
      };
      console.log(newSubkriteria);
      await createSubkriteria(newSubkriteria); // Fungsi untuk menambah subkriteria ke Firestore
      //   toast.success("Subkriteria berhasil ditambahkan!");
      setSubkriteria("");
      setNilaiTarget(0);
      setTipe("Core");
      setSelectedKriteria(null); // Reset pilihan kriteria
    } catch (error) {
      //   toast.error("Gagal menambahkan subkriteria.");
      console.error("Gagal mengambil Subkriteria", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Tambah Subkriteria</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Pilih Kriteria */}
        <div className="flex flex-col">
          <label htmlFor="kodeKriteria" className="mb-2">
            Pilih Kriteria
          </label>
          <Select
            value={selectedKriteria?.id ?? ""}
            onValueChange={(id) => {
              const found = kriteriaList.find((k) => k.id === id);
              setSelectedKriteria(found || null);
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kriteria" />
            </SelectTrigger>
            <SelectContent>
              {kriteriaList.map((kriteria) => (
                <SelectItem key={kriteria.id} value={kriteria.id}>
                  {kriteria.kriteria} ({kriteria.kode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nama Subkriteria */}
        <div className="flex flex-col">
          <label htmlFor="subkriteria" className="mb-2">
            Nama Subkriteria
          </label>
          <Input
            id="subkriteria"
            value={subkriteria}
            onChange={(e) => setSubkriteria(e.target.value)}
            required
            className="border-gray-300"
          />
        </div>

        {/* Nilai Target */}
        <div className="flex flex-col">
          <label htmlFor="kodeKriteria" className="mb-2">
            Target Penilaian
          </label>
          <Select
            value={String(nilaiTarget)} // Convert number to string
            onValueChange={(value) => setNilaiTarget(Number(value))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Penilaian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Buruk</SelectItem>
              <SelectItem value="2">Sedang</SelectItem>
              <SelectItem value="3">Cukup</SelectItem>
              <SelectItem value="4">Baik</SelectItem>
              <SelectItem value="5">Sangat Baik</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipe */}
        <div className="flex flex-col">
          <label className="mb-2">Tipe Subkriteria</label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              onClick={() => setTipe("Core")}
              variant={tipe === "Core" ? "default" : "outline"}
            >
              Core
            </Button>
            <Button
              type="button"
              onClick={() => setTipe("Secondary")}
              variant={tipe === "Secondary" ? "default" : "outline"}
            >
              Secondary
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sedang Menambah..." : "Tambah Subkriteria"}
        </Button>
      </form>

      {/* <ToastContainer /> */}
       <CustomAlert
              type={alert.type}
              message={alert.message}
              show={alert.show}
              onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
            />
    </div>
  );
};

export default TambahSubkriteriaPage;
