/* eslint-disable */
"use client";

import React, { useEffect, useState } from "react";
import {
  getAllAuditTrail,
  deleteAuditTrailById,
} from "@/lib/firestore/audit-trail";
// import { IPenilaianAuditTrail } from "@/lib/firestore/audit-trail";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
// import di atas
import SnapshotModal from "@/components/ui/SnapshotModal";

const RiwayatProfileMatching = () => {
  const [riwayat, setRiwayat] = useState<IPenilaianAuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IPenilaianAuditTrail | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getAllAuditTrail();
    setRiwayat(data.reverse()); // biar yang terbaru di atas
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus snapshot ini?")) return;
    await deleteAuditTrailById(id);
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Profile Matching</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : riwayat.length === 0 ? (
        <p>Tidak ada data riwayat.</p>
      ) : (
        <table className="w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">#</th>
              <th className="border px-2 py-1">Periode</th>
              <th className="border px-2 py-1">Tanggal</th>
              <th className="border px-2 py-1">Jumlah Dosen</th>
              <th className="border px-2 py-1">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.map((item, i) => {
              let parsed: any = {};
              try {
                parsed = JSON.parse(item.penilaian);
              } catch {}

              return (
                <tr key={item.id}>
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{item.periode}</td>
                  <td className="border px-2 py-1">
                    {parsed.timestamp
                      ? format(new Date(parsed.timestamp), "dd/MM/yyyy HH:mm")
                      : "-"}
                  </td>
                  <td className="border px-2 py-1">
                    {parsed.data?.length ?? "-"}
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelected(item)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal Detail */}
      {/* {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-3xl w-full overflow-y-auto max-h-[90vh] shadow-lg relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              Detail Snapshot: {selected.periode}
            </h2>

            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(JSON.parse(selected.penilaian), null, 2)}
            </pre>
          </div>
        </div>
      )} */}
      <SnapshotModal
        show={!!selected}
        onClose={() => setSelected(null)}
        data={selected ? JSON.parse(selected.penilaian) : null}
      />
    </div>
  );
};

export default RiwayatProfileMatching;
