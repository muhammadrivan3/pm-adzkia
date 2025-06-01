// pages/aspek.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllKriteria, Kriteria } from "@/lib/firestore/kriteria";
import { getSubkriteriaByKriteriaId, Subkriteria } from "@/lib/firestore/sub-kriteria";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

// Tipe data Subkriteria lengkap
type SubkriteriaWithFullProps = Subkriteria & {
  kriteriaId: string;
};

const AspekPage = () => {
  const [data, setData] = useState<(Kriteria & { subkriteria: SubkriteriaWithFullProps[] })[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kriteriaList = await getAllKriteria(); // Ambil kriteria dari firestore
        const combined = await Promise.all(
          kriteriaList.map(async (kriteria: Kriteria) => {
            // Ambil subkriteria berdasarkan kode kriteria
            const subkriteria = await getSubkriteriaByKriteriaId(kriteria.kode);

            // Gabungkan subkriteria dengan kriteria
            const fullSubkriteria = subkriteria.map((sub) => ({
              ...sub,
              kriteriaId: kriteria.kode, // Menambahkan kriteriaId
            }));

            return { ...kriteria, subkriteria: fullSubkriteria };
          })
        );
        setData(combined); // Update state dengan data yang sudah lengkap
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Button asChild className="gap-2">
        <Link href="/user/add-user">
          <Plus className="w-4 h-4" /> Tambah Aspek
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kriteria dan Subkriteria</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Kode</TableHead>
                <TableHead>Kriteria</TableHead>
                <TableHead>Subkriteria</TableHead>
                <TableHead>Nilai Target</TableHead>
                <TableHead>Tipe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((kriteria) =>
                kriteria.subkriteria.map((sub, idx) => (
                  <TableRow key={sub.kode}> {/* Menggunakan kode subkriteria sebagai key */}
                    {idx === 0 ? (
                      <>
                        <TableCell rowSpan={kriteria.subkriteria.length}>
                          {kriteria.kode}
                        </TableCell>
                        <TableCell rowSpan={kriteria.subkriteria.length}>
                          {kriteria.kriteria}
                        </TableCell>
                      </>
                    ) : null}
                    <TableCell>{sub.subkriteria}</TableCell>
                    <TableCell>{sub.nilaiTarget}</TableCell>
                    <TableCell>{sub.tipe}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AspekPage;
