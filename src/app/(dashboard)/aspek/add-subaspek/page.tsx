// pages/tambah-subkriteria.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllKriteria } from "@/lib/firestore/kriteria";
import { createSubkriteria } from "@/lib/firestore/sub-kriteria";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const TambahSubkriteriaPage = () => {
  const [kriteriaList, setKriteriaList] = useState<IKriteria[]>([]);
  const [kodeKriteria, setKodeKriteria] = useState<string>("");
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
      const newSubkriteria: ISubKriteriaCreate = {
        kriteriaId: kodeKriteria,
        subkriteria,
        nilaiTarget,
        kode: `SK${Date.now()}`, // Bisa menggunakan timestamp sebagai kode unik
        tipe,
      };
      await createSubkriteria(newSubkriteria); // Fungsi untuk menambah subkriteria ke Firestore
    //   toast.success("Subkriteria berhasil ditambahkan!");
      setSubkriteria("");
      setNilaiTarget(0);
      setTipe("Core");
      setKodeKriteria(""); // Reset pilihan kriteria
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
          <label htmlFor="kodeKriteria" className="mb-2">Pilih Kriteria</label>
          <Select
            value={kodeKriteria}
            onValueChange={setKodeKriteria}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kriteria" />
            </SelectTrigger>
            <SelectContent>
              {kriteriaList.map((kriteria) => (
                <SelectItem key={kriteria.kode} value={kriteria.kode}>
                  {kriteria.kriteria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nama Subkriteria */}
        <div className="flex flex-col">
          <label htmlFor="subkriteria" className="mb-2">Nama Subkriteria</label>
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
          <label htmlFor="nilaiTarget" className="mb-2">Nilai Target</label>
          <Input
            id="nilaiTarget"
            type="number"
            value={nilaiTarget}
            onChange={(e) => setNilaiTarget(Number(e.target.value))}
            required
            className="border-gray-300"
          />
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
    </div>
  );
};

export default TambahSubkriteriaPage;
