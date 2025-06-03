"use client";

import React, { useEffect, useState } from "react";
import { getAllPenilaian } from "@/lib/firestore/penilaian";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const PenilaianPage = () => {
  const [data, setData] = useState<
    (IPenilaian & { id?: string; dosenNama: string; subkriteriaNama: string })[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const penilaianList = await getAllPenilaian();
        const dosenList = await getAllDosen();
        const subkriteriaList = await getAllSubkriteria();

        const enriched = penilaianList.map((item: IPenilaian) => {
          const dosen = dosenList.find((d: IDosen) => d.id === item.dosenId);
          const sub = subkriteriaList.find(
            (s: ISubKriteria) => s.id === item.subkriteriaId
          );
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
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif border-b-2 pb-1 border-blue-500">
          Manajemen Penilaian
        </h1>
        <Button asChild className="gap-2">
          <Link href="/penilaian/add-penilaian">
            <Plus className="w-4 h-4" /> Tambah Penilaian
          </Link>
        </Button>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
        <Card>
          {/* <CardHeader>
            <CardTitle>Daftar Penilaian</CardTitle>
          </CardHeader> */}
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
    </div>
  );
};

export default PenilaianPage;
