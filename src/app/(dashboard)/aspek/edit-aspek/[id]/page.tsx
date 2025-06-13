"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getKriteriaById, updateKriteria } from "@/lib/firestore/kriteria";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditKriteriaPage = () => {
  const router = useRouter();
  const {id} = useParams(); // Ambil ID dari URL (?id=...)
  const [loading, setLoading] = useState(false);
  const [kode, setKode] = useState("");
  const [kriteria, setKriteria] = useState("");
  const [persentaseCore, setPersentaseCore] = useState(0);
  const [persentaseSecondary, setPersentaseSecondary] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getKriteriaById(id as string);
      console.log("DATA :",data);
      if (data) {
        setKode(data.kode);
        setKriteria(data.kriteria);
        setPersentaseCore(data.persentaseCore);
        setPersentaseSecondary(data.persentaseSecondary);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (persentaseCore + persentaseSecondary !== 100) {
        alert("Total persentase Core dan Secondary harus 100%");
        setLoading(false);
        return;
      }

      if (persentaseCore <= persentaseSecondary) {
        alert("Persentase Core harus lebih besar dari Secondary!");
        setLoading(false);
        return;
      }

      const updatedData = {
        kode,
        kriteria,
        persentaseCore,
        persentaseSecondary,
      };

      await updateKriteria(id as string, updatedData);
      // alert("Kriteria berhasil diperbarui!");
      router.push("/aspek"); // redirect ke halaman daftar
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Ubah Kriteria</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="kode" className="mb-2">Kode Kriteria</label>
          <Input
            id="kode"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            required
            className="border-gray-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="kriteria" className="mb-2">Nama Kriteria</label>
          <Input
            id="kriteria"
            value={kriteria}
            onChange={(e) => setKriteria(e.target.value)}
            required
            className="border-gray-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="persentaseCore" className="mb-2">Presentase Core (%)</label>
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
          <label htmlFor="persentaseSecondary" className="mb-2">Presentase Secondary (%)</label>
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
          {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
};

export default EditKriteriaPage;
