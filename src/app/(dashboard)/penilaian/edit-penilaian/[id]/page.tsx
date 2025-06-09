"use client";

import { getPenilaianById } from "@/lib/firestore/penilaian";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditPenilaianPage = () => {
  const { id } = useParams();
  const [penilaianData, setPenilaianData] = useState({
    id: "",
    dosenId: "",
    subkriteriaId: "",
    nilai: 0,
  }); // Sesuaikan tipe jika punya tipe data khusus
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPenilaianData = async () => {
        try {
          const penilaianDoc = await getPenilaianById(id as string);
          if(penilaianDoc){
            setPenilaianData({
            id: penilaianDoc.id || "",
            dosenId: penilaianDoc.dosenId || "",
            subkriteriaId: penilaianDoc.subkriteriaId || "",
            nilai: penilaianDoc.nilai || 0,
          });
          }
        } catch (error) {
          console.error("Gagal mengambil data penilaian:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPenilaianData();
    }
  }, [id]);

  if (loading) return <div className="p-4">Memuat data...</div>;
  if (!penilaianData) return <div className="p-4">Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-start bg-background px-4 py-6">
      <h1 className="text-xl font-bold mb-4">Edit Penilaian</h1>
      <pre className="bg-muted p-4 rounded">
        {JSON.stringify(penilaianData, null, 2)}
      </pre>
      {/* Tambahkan form edit di sini */}
    </div>
  );
};

export default EditPenilaianPage;
