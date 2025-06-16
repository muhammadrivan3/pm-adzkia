"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllKriteria } from "@/lib/firestore/kriteria";
import { updateSubkriteria } from "@/lib/firestore/sub-kriteria";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EditSubkriteriaPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const [kriteriaList, setKriteriaList] = useState<IKriteria[]>([]);
  const [selectedKriteria, setSelectedKriteria] = useState<IKriteria | null>(null);
  const [subkriteria, setSubkriteria] = useState<string>("");
  const [nilaiTarget, setNilaiTarget] = useState<number>(0);
  const [tipe, setTipe] = useState<"Core" | "Secondary">("Core");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchSubkriteria = async () => {
      setFetching(true);
      setError(null);
      try {
        const docRef = doc(db, "subkriteria", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ISubKriteria;
          setSubkriteria(data.subkriteria);
          setNilaiTarget(data.nilaiTarget);
          setTipe(data.tipe);
          // Find the kriteria object from kriteriaList or set null temporarily
          setSelectedKriteria({ id: data.kriteriaId, kode: data.kriteriaKode, kriteria: "", persentaseCore: 0, persentaseSecondary: 0 });
        } else {
          setError("Subkriteria tidak ditemukan");
        }
      } catch (error) {
        setError("Gagal mengambil data subkriteria");
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchSubkriteria();
  }, [id]);

  // To update selectedKriteria object fully once kriteriaList is loaded
  useEffect(() => {
    if (selectedKriteria && selectedKriteria.kriteria === "" && kriteriaList.length > 0) {
      const found = kriteriaList.find((k) => k.id === selectedKriteria.id);
      setSelectedKriteria(found || null);
    }
  }, [kriteriaList, selectedKriteria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!selectedKriteria) {
        setError("Kriteria belum dipilih!");
        setLoading(false);
        return;
      }
      const updatedSubkriteria: Partial<ISubKriteria> = {
        kriteriaId: selectedKriteria.id,
        kriteriaKode: selectedKriteria.kode,
        subkriteria,
        nilaiTarget,
        tipe,
      };
      await updateSubkriteria(id, updatedSubkriteria);
      router.push("/aspek"); // Redirect after update, adjust path as needed
    } catch (error) {
      setError("Gagal memperbarui subkriteria.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Edit Subkriteria</h2>
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

        {error && <div className="text-red-600">{error}</div>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sedang Memperbarui..." : "Perbarui Subkriteria"}
        </Button>
      </form>
    </div>
  );
};

export default EditSubkriteriaPage;
