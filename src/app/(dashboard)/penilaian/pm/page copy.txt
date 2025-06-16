/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import { getAllPenilaian } from "@/lib/firestore/penilaian";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { getAllKriteria } from "@/lib/firestore/kriteria";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DosenWithGap {
  id: string;
  nama: string;
  nilai: Record<string, number>; // subkriteriaId -> nilai
  gap: Record<string, number>; // subkriteriaId -> gap
  bobot: Record<string, number>; // subkriteriaId -> bobot
  total: number;
}
interface Kriteria {
  id: string;
  kode: string;
  kriteria: string;
  persentaseCore: number;
  persentaseSecondary: number;
  bobot: number;
}
const ProfileMatchingCalculation = () => {
  const [dosenList, setDosenList] = useState<DosenWithGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProcessPm, setLoadingProcessPm] = useState(true);
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const fetchKriteria = async () => {
      const data = await getAllKriteria();
      // tambahkan bobot default = 0
      const enriched = data.map((k: any) => ({ ...k, bobot: 0 }));
      setKriteriaList(enriched);
      setLoading(false);
    };

    fetchKriteria();
  }, []);

  const handleChangeBobot = (index: number, value: number) => {
    const updated = [...kriteriaList];
    updated[index].bobot = value;
    setKriteriaList(updated);
  };
  const totalBobot = kriteriaList.reduce((sum, item) => sum + item.bobot, 0);

  const handleSubmit = () => {
    if (totalBobot !== 100) {
      alert("Total bobot harus 100%");
      return;
    }

    console.log("Data bobot yang akan dipakai:", kriteriaList);
    // bisa diproses ke mana pun (perhitungan, penyimpanan ke tabel lain, dst)
  };

  const handleProcess = async () => {
    if (totalBobot !== 100) {
      alert("Total bobot harus 100%");
      return;
    }
    setLoadingProcessPm(true);
    setHasProcessed(false);
    const [penilaian, dosen, subkriteria, kriteria] = await Promise.all([
      getAllPenilaian(),
      getAllDosen(),
      getAllSubkriteria(),
      getAllKriteria(),
    ]);
    const groupedByDosen: Record<string, DosenWithGap> = {};
    dosen.forEach((d) => {
      groupedByDosen[d.id] = {
        id: d.id,
        nama: d.name,
        nilai: {},
        gap: {},
        bobot: {},
        total: 0,
      };
    });
    penilaian.forEach((p) => {
      const sub = subkriteria.find((s) => s.id === p.subkriteriaId);
      if (!sub) return;
      const target = sub.nilaiTarget ?? 3; // default target 3 jika tidak ada
      const gap = p.nilai - target;
      const bobot =
        gap === 0
          ? 5
          : gap === 1
          ? 4.5
          : gap === -1
          ? 4
          : gap === 2
          ? 3.5
          : gap === -2
          ? 3
          : gap === 3
          ? 2.5
          : gap === -3
          ? 2
          : gap === 4
          ? 1.5
          : gap === -4
          ? 1
          : 0;
      groupedByDosen[p.dosenId].bobot[String(p.subkriteriaId)] = bobot;
      groupedByDosen[p.dosenId].nilai[String(p.subkriteriaId)] = p.nilai;
      groupedByDosen[p.dosenId].gap[String(p.subkriteriaId)] = gap;
    });
    // Hitung total bobot untuk setiap kriteria
    for (const d of Object.values(groupedByDosen)) {
      let total = 0;
      for (const k of kriteriaList) {
        const subList = subkriteria.filter((s) => s.kriteriaId === k.id);
        const core = subList.filter((s) => s.tipe === "Core").length;
        const secondary = subList.filter((s) => s.tipe === "Secondary").length;
        const sumCoreDosen = subList.reduce((count, s) => {
          if (s.tipe == "Core") {
            count += d.bobot[String(s.id)];
          }
          return count;
        }, 0);
        const sumSecondaryDosen = subList.reduce((count, s) => {
          if (s.tipe == "Secondary") {
            count += d.bobot[String(s.id)];
          }
          return count;
        }, 0);
        console.log("Dosen : ", d.nama);
        console.log("Kriteria : ", k.kriteria);
        console.log("Core : ", sumCoreDosen);
        console.log("Secondary : ", sumSecondaryDosen);
        const totalCoreT = sumCoreDosen / core;
        const totalSecondaryT = sumSecondaryDosen / secondary;
        console.log("Persentase Core : ", k.persentaseCore / 100);
        console.log("Persentase Secondary : ", k.persentaseSecondary / 100);
        console.log("NCI Core : ", totalCoreT);
        console.log("NCI Secondary : ", totalSecondaryT);
        // totalCore = 0;
        // totalSecondary = 0;
        // Perhitungan nilai total I
        let totalPerKriteria =
          (k.persentaseCore / 100) * totalCoreT +
          (k.persentaseSecondary / 100) * totalSecondaryT;
        // Perhitungan nilai total II
        total += totalPerKriteria * (k.bobot / 100);
        console.log("Total : ", total);
      }
      d.total = total;
    }

    console.log("Hasil Akhir Semua Dosen : ", groupedByDosen);
    setDosenList(Object.values(groupedByDosen));
    setLoadingProcessPm(false);
    setHasProcessed(true); // proses selesai
    // console.log("Data bobot yang akan dipakai:", kriteriaList);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const [penilaian, dosen, subkriteria, kriteria] = await Promise.all([
  //       getAllPenilaian(),
  //       getAllDosen(),
  //       getAllSubkriteria(),
  //       getAllKriteria(),
  //     ]);
  //     // console.log(kriteria);
  //     // console.log(subkriteria);
  //     // console.log(penilaian);

  //     const groupedByDosen: Record<string, DosenWithGap> = {};

  //     dosen.forEach((d) => {
  //       groupedByDosen[d.id] = {
  //         id: d.id,
  //         nama: d.name,
  //         nilai: {},
  //         gap: {},
  //         bobot: {},
  //         total: 0,
  //       };
  //     });

  //     penilaian.forEach((p) => {
  //       const sub = subkriteria.find((s) => s.id === p.subkriteriaId);
  //       // console.log(penilaian);
  //       if (!sub) return;
  //       const target = sub.nilaiTarget ?? 3; // default target 3 jika tidak ada
  //       // console.log(target);
  //       const gap = p.nilai - target;
  //       // console.log(gap);
  //       // console.log("BERJALAN!!!");
  //       // const bobot =
  //       //   gap === 0 ? 5 :
  //       //   gap === 1 || gap === -1 ? 4.5 :
  //       //   gap === 2 || gap === -2 ? 4 :
  //       //   gap === 3 || gap === -3 ? 3.5 :
  //       //   3; // default bobot
  //       const bobot =
  //         gap === 0
  //           ? 5
  //           : gap === 1
  //           ? 4.5
  //           : gap === -1
  //           ? 4
  //           : gap === 2
  //           ? 3.5
  //           : gap === -2
  //           ? 3
  //           : gap === 3
  //           ? 2.5
  //           : gap === -3
  //           ? 2
  //           : gap === 4
  //           ? 1.5
  //           : gap === -4
  //           ? 1
  //           : 0;
  //       // groupedByDosen[p.dosenId].nilai[p.subkriteriaId] = p.nilai;
  //       // groupedByDosen[p.dosenId].gap[p.subkriteriaId] = gap;
  //       // groupedByDosen[p.dosenId].bobot[p.subkriteriaId] = bobot;
  //       groupedByDosen[p.dosenId].bobot[String(p.subkriteriaId)] = bobot;
  //       groupedByDosen[p.dosenId].nilai[String(p.subkriteriaId)] = p.nilai;
  //       groupedByDosen[p.dosenId].gap[String(p.subkriteriaId)] = gap;
  //     });
  //     // Hitung total bobot untuk setiap kriteria
  //     for (const d of Object.values(groupedByDosen)) {
  //       let total = 0;
  //       let totalCore = 0;
  //       let totalSecondary = 0;
  //       for (const k of kriteria) {
  //         const subList = subkriteria.filter((s) => s.kriteriaId === k.id);
  //         // console.log(subList);
  //         // const core = subList.reduce((countCore, s) => {
  //         //   if (s.tipe == "Core") {
  //         //     countCore++;
  //         //   }
  //         //   return countCore;
  //         // }, 0);
  //         const core = subList.filter((s) => s.tipe === "Core").length;
  //         const secondary = subList.filter(
  //           (s) => s.tipe === "Secondary"
  //         ).length;
  //         const sumCoreDosen = subList.reduce((count, s) => {
  //           if (s.tipe == "Core") {
  //             count += d.bobot[String(s.id)];
  //           }
  //           return count;
  //         }, 0);
  //         const sumSecondaryDosen = subList.reduce((count, s) => {
  //           if (s.tipe == "Secondary") {
  //             count += d.bobot[String(s.id)];
  //           }
  //           return count;
  //         }, 0);
  //         console.log("Dosen : ", d.nama);
  //         console.log("Kriteria : ", k.kriteria);
  //         console.log("Core : ", sumCoreDosen);
  //         console.log("Secondary : ", sumSecondaryDosen);
  //         // const sum = subList.reduce((acc, s) => acc + (d.bobot[s.id] ?? 0), 0);
  //         // const sum = subList.reduce((acc, s) => {
  //         //   console.log("Dosen :", d.bobot);
  //         //   console.log("Subkriteria ID:", s.id);
  //         //   console.log("Bobot ditemukan:", d.bobot[String(s.id)]);
  //         //   return acc + (d.bobot[s.id] ?? 0);
  //         // }, 0);
  //         // console.log(sum);
  //         // const avg = subList.length > 0 ? sum / subList.length : 0;
  //         // total += avg * (k.bobot ?? 1); // default bobot 1 jika tidak ada
  //         // total += avg * 1;
  //         totalCore = 0;
  //         totalSecondary = 0;
  //       }
  //       d.total = total;
  //     }

  //     setDosenList(Object.values(groupedByDosen));
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">Bobot Setiap Kriteria</h1>

        {loading ? (
          <p>Memuat data kriteria...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {kriteriaList.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <Label className="block mb-1 text-sm font-medium text-gray-700">
                        {item.kriteria}
                      </Label>
                      <Input
                        type="number"
                        value={item.bobot}
                        onChange={(e) =>
                          handleChangeBobot(index, Number(e.target.value))
                        }
                        min={0}
                        max={100}
                        className="border border-gray-300"
                      />
                    </div>
                    {/* <div className="text-gray-600">
                      Bobot saat ini: <strong>{item.bobot}%</strong>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <p className="mb-2 text-sm">
                Total Bobot:{" "}
                <span
                  className={
                    totalBobot === 100 ? "text-green-600" : "text-red-600"
                  }
                >
                  {totalBobot}%
                </span>
              </p>
              <Button onClick={handleProcess} disabled={totalBobot !== 100}>
                Prosess
              </Button>
            </div>
          </>
        )}
      </div>
      <h1 className="text-2xl font-bold">Hasil Profile Matching</h1>
      {!hasProcessed ? (
        <div className="text-gray-500 italic">Belum melakukan proses.</div>
      ) : loadingProcessPm ? (
        <div className="flex items-center space-x-2 text-blue-600">
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Memproses data...</span>
        </div>
      ) : (
        <div className="space-y-2">
          {dosenList
            .sort((a, b) => b.total - a.total)
            .map((d, i) => (
              <div
                key={d.id}
                className="border p-4 rounded-lg shadow-sm bg-white dark:bg-zinc-900"
              >
                <p>
                  <strong>
                    {i + 1}. {d.nama}
                  </strong>
                </p>
                <p>Total Nilai: {d.total.toFixed(2)}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProfileMatchingCalculation;
