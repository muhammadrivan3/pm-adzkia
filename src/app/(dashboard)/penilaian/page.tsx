"use client";

import React, { useEffect, useState } from "react";
import {
  getAllPenilaian,
  Penilaian,
} from "@/lib/firestore/penilaian";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface Dosen {
  id: string;
  name: string;
}

interface Subkriteria {
  id: string;
  subkriteria: string;
}

const PenilaianPage = () => {
  const [data, setData] = useState<
    (Penilaian & { id: string; dosenNama: string; subkriteriaNama: string })[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const penilaianList = await getAllPenilaian();
        const dosenList = await getAllDosen();
        const subkriteriaList = await getAllSubkriteria();

        const enriched = penilaianList.map((item: any) => {
          const dosen = dosenList.find((d: Dosen) => d.id === item.dosenId);
          const sub = subkriteriaList.find((s: Subkriteria) => s.id === item.subkriteriaId);
          return {
            ...item,
            dosenNama: dosen?.name || "Tidak ditemukan",
            subkriteriaNama: sub?.subkriteria || "Tidak ditemukan",
          };
        });

        setData(enriched);
      } catch (error) {
        console.error("Gagal mengambil data penilaian:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
       <Button asChild className="gap-2">
        <Link href="/penilaian/add-penilaian">
          <Plus className="w-4 h-4" /> Tambah Penilaian
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Penilaian</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Dosen</TableHead>
                <TableHead>Subkriteria</TableHead>
                <TableHead>Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.dosenNama}</TableCell>
                  <TableCell>{item.subkriteriaNama}</TableCell>
                  <TableCell>{item.nilai}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PenilaianPage;
