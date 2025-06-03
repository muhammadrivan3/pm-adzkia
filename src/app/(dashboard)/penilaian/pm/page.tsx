"use client";

import React, { useEffect, useState } from "react";
import { getAllPenilaian } from "@/lib/firestore/penilaian";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { getAllKriteria } from "@/lib/firestore/kriteria";

interface DosenWithGap {
  id: string;
  nama: string;
  nilai: Record<string, number>; // subkriteriaId -> nilai
  gap: Record<string, number>; // subkriteriaId -> gap
  bobot: Record<string, number>; // subkriteriaId -> bobot
  total: number;
}

const ProfileMatchingCalculation = () => {
  const [dosenList, setDosenList] = useState<DosenWithGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        const sub = subkriteria.find((s) => s.id === p.id);
        if (!sub) return;

        const target = sub.nilaiTarget ?? 3; // default target 3 jika tidak ada
        const gap = p.nilai  - target;

        const bobot =
          gap === 0 ? 5 :
          gap === 1 || gap === -1 ? 4.5 :
          gap === 2 || gap === -2 ? 4 :
          gap === 3 || gap === -3 ? 3.5 :
          3; // default bobot

        groupedByDosen[p.dosenId].nilai[p.subkriteriaId] = p.nilai;
        groupedByDosen[p.dosenId].gap[p.subkriteriaId] = gap;
        groupedByDosen[p.dosenId].bobot[p.subkriteriaId] = bobot;
      });

      // Hitung total bobot untuk setiap kriteria
      for (const d of Object.values(groupedByDosen)) {
        let total = 0;
        for (const k of kriteria) {
          const subList = subkriteria.filter((s) => s.kriteriaId === k.id);
          const sum = subList.reduce((acc, s) => acc + (d.bobot[s.id] ?? 0), 0);
          const avg = subList.length > 0 ? sum / subList.length : 0;
          // total += avg * (k.bobot ?? 1); // default bobot 1 jika tidak ada
          total += avg * 1;
        }
        d.total = total;
      }

      setDosenList(Object.values(groupedByDosen));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Hasil Profile Matching</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {dosenList.sort((a, b) => b.total - a.total).map((d, i) => (
            <div
              key={d.id}
              className="border p-4 rounded-lg shadow-sm bg-white dark:bg-zinc-900"
            >
              <p><strong>{i + 1}. {d.nama}</strong></p>
              <p>Total Nilai: {d.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileMatchingCalculation;
