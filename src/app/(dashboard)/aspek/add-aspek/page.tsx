// pages/tambah-kriteria.tsx
"use client";

import React, { useState } from "react";
import { createKriteria } from "@/lib/firestore/kriteria";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomAlert from "@/components/ui/CustomAlert";

const TambahKriteriaPage = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  const [kode, setKode] = useState("");
  const [kriteria, setKriteria] = useState("");
  const [persentaseCore, setPersentaseCore] = useState(0);
  const [persentaseSecondary, setPersentaseSecondary] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (persentaseCore + persentaseSecondary !== 100) {
        setAlert({
          type: "warning",
          message: "Total persentase Core dan Secondary harus 100%",
          show: true,
        });
        setLoading(false);
        return;
      }

      if (persentaseCore <= persentaseSecondary) {
        setAlert({
          type: "warning",
          message: "Persentase Core harus lebih besar dari Secondary!",
          show: true,
        });
        setLoading(false);
        return;
      }

      const newKriteria: IKriteriaCreate = {
        kode,
        kriteria,
        persentaseCore,
        persentaseSecondary,
      };
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

        <div className="flex flex-col">
          <label htmlFor="persentaseCore" className="mb-2">
            Presentase Core (%)
          </label>
          <Input
            id="persentaseCore"
            type="number"
            value={persentaseCore}
            onChange={(e) => setPersentaseCore(Number(e.target.value))}
            required
            className="border-gray-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="persentaseSecondary" className="mb-2">
            Presentase Secondary (%)
          </label>
          <Input
            id="persentaseSecondary"
            type="number"
            value={persentaseSecondary}
            onChange={(e) => setPersentaseSecondary(Number(e.target.value))}
            required
            className="border-gray-300"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sedang Menambah..." : "Tambah Kriteria"}
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

export default TambahKriteriaPage;
