// pages/tambah-kriteria.tsx
"use client";

import React, { useState } from "react";
import { createKriteria } from "@/lib/firestore/kriteria";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TambahKriteriaPage = () => {
  const [kode, setKode] = useState("");
  const [kriteria, setKriteria] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newKriteria: IKriteriaCreate = { kode, kriteria };
      await createKriteria(newKriteria); // Fungsi untuk menambah kriteria ke Firestore
      //   toast.success(`Kriteria berhasil ditambahkan dengan ID: ${id}`);
      // Reset form setelah berhasil
      setKode("");
      setKriteria("");
    } catch (error) {
      //   toast.error("Gagal menambahkan kriteria. Silakan coba lagi.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Tambah Kriteria</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="kode" className="mb-2">
            Kode Kriteria
          </label>
          <Input
            id="kode"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            required
            className="border-gray-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kriteria" className="mb-2">
            Nama Kriteria
          </label>
          <Input
            id="kriteria"
            value={kriteria}
            onChange={(e) => setKriteria(e.target.value)}
            required
            className="border-gray-300"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sedang Menambah..." : "Tambah Kriteria"}
        </Button>
      </form>

      {/* <ToastContainer /> */}
    </div>
  );
};

export default TambahKriteriaPage;
