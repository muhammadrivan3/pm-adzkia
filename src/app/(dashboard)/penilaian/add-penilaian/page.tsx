"use client";

import { useEffect, useState } from "react";
import { Dosen, getAllDosen } from "@/lib/firestore/dosen";
import {  SubkriteriaP, getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { createPenilaian } from "@/lib/firestore/penilaian";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddPenilaianPage = () => {
  const [dosenList, setDosenList] = useState<Dosen[]>([]);
  const [subList, setSubList] = useState<SubkriteriaP[]>([]);
  const [dosenId, setDosenId] = useState("");
  const [subkriteriaId, setSubkriteriaId] = useState("");
  const [nilai, setNilai] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const dosen = await getAllDosen();
      const sub = await getAllSubkriteria();
      setDosenList(dosen);
      setSubList(sub);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dosenId || !subkriteriaId || nilai <= 0) {
      alert("Semua field harus diisi dengan benar");
      return;
    }

    await createPenilaian({ dosenId, subkriteriaId, nilai });
    router.push("/penilaian"); // Redirect ke daftar penilaian
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tambah Penilaian</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Dosen</Label>
          <Select onValueChange={(value) => setDosenId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Dosen" />
            </SelectTrigger>
            <SelectContent>
              {dosenList.map((dosen) => (
                <SelectItem key={dosen.id} value={dosen.id}>
                  {dosen.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Subkriteria</Label>
          <Select onValueChange={(value) => setSubkriteriaId(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Subkriteria" />
            </SelectTrigger>
            <SelectContent>
              {subList.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.subkriteria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Nilai</Label>
          <Input
            type="number"
            value={nilai}
            onChange={(e) => setNilai(Number(e.target.value))}
            min={0}
            max={100}
          />
        </div>

        <Button type="submit" className="w-full">
          Simpan Penilaian
        </Button>
      </form>
    </div>
  );
};

export default AddPenilaianPage;
