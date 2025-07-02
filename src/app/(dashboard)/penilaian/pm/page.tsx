/* eslint-disable */
"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAllPenilaian } from "@/lib/firestore/penilaian";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { getAllKriteria } from "@/lib/firestore/kriteria";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, Printer, SaveIcon } from "lucide-react";
import CustomAlert from "@/components/ui/CustomAlert";
import { createAuditTrail } from "@/lib/firestore/audit-trail";

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
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  const [dosenList, setDosenList] = useState<DosenWithGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProcessPm, setLoadingProcessPm] = useState(true);
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([]);
  const [hasProcessed, setHasProcessed] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedDosen, setSelectedDosen] = useState<DosenWithGap | null>(null);
  const [subkriteriaList, setSubkriteriaList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [periodeList, setPeriodeList] = useState<string[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string>("");
  useEffect(() => {
    const fetchKriteria = async () => {
      const data = await getAllKriteria();
      // tambahkan bobot default = 0
      const enriched = data.map((k: any) => ({ ...k, bobot: 0 }));
      setKriteriaList(enriched);
      setLoading(false);
    };
    const fetchPeriode = async () => {
      const dosen = await getAllDosen();
      const periodeSet = new Set<string>();
      dosen.forEach((d) => {
        d.jabatan.forEach((j) => {
          periodeSet.add(j.periode); // Misal "2024-2025"
        });
      });
      setPeriodeList(Array.from(periodeSet).sort());
    };
    fetchKriteria();
    fetchPeriode();
  }, []);

  const handleChangeBobot = (index: number, value: number) => {
    const updated = [...kriteriaList];
    updated[index].bobot = value;
    setKriteriaList(updated);
  };
  const totalBobot = kriteriaList.reduce((sum, item) => sum + item.bobot, 0);

  const handleProcess = async () => {
    if (!selectedPeriode) {
      setAlert({
        type: "warning",
        message: "Silakan pilih periode terlebih dahulu.",
        show: true,
      });
      return;
    }
    if (totalBobot !== 100) {
      setAlert({
        type: "warning",
        message: "Total bobot harus 100%",
        show: true,
      });
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
    const dosenFiltered = dosen.filter((d) =>
      d.jabatan.some((j) => j.periode === selectedPeriode)
    );
    const groupedByDosen: Record<string, DosenWithGap> = {};
    dosenFiltered.forEach((d) => {
      groupedByDosen[d.id] = {
        id: d.id,
        nama: d.nama,
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
      if (!groupedByDosen[p.dosenId]) return;
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
        const totalCoreT = core > 0 ? sumCoreDosen / core : 0;
        const totalSecondaryT =
          secondary > 0 ? sumSecondaryDosen / secondary : 0;
        let totalPerKriteria =
          (k.persentaseCore / 100) * totalCoreT +
          (k.persentaseSecondary / 100) * totalSecondaryT;
        total += totalPerKriteria * (k.bobot / 100);
      }
      d.total = total;
    }

    setDosenList(Object.values(groupedByDosen));
    setLoadingProcessPm(false);
    setHasProcessed(true); // proses selesai
    setSubkriteriaList(subkriteria);
  };

  const exportToCsv = () => {
    if (!dosenList.length) {
      setAlert({
        type: "warning",
        message: "Tidak ada data untuk diekspor.",
        show: true,
      });
      return;
    }
    const headers = ["No", "Nama Dosen", "Total Nilai"];
    const rows = dosenList
      .sort((a, b) => b.total - a.total)
      .map((d, i) => [i + 1, d.nama, d.total.toFixed(2)]);
    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "profile_matching_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print(); // ✅ langsung panggil native dialog
  };
  const SaveData = async () => {
    if (!hasProcessed || dosenList.length === 0) {
      setAlert({
        type: "warning",
        message: "Belum ada data hasil yang bisa disimpan.",
        show: true,
      });
      return;
    }

    // Bentuk struktur JSON final
    const resultSnapshot = {
      periode: selectedPeriode,
      timestamp: new Date().toISOString(),
      data: dosenList
        .sort((a, b) => b.total - a.total)
        .map((d, i) => ({
          no: i + 1,
          nama: d.nama,
          total: Number(d.total.toFixed(2)),
          nilai: d.nilai, // subkriteria => nilai user
          gap: d.gap, // subkriteria => gap
          bobot: d.bobot, // subkriteria => bobot
        })),
    };

    try {
      // Simpan ke Firestore dalam format string
      await createAuditTrail({
        dosen: "All", // atau bisa dikosongkan kalau bukan individual
        penilaian: JSON.stringify(resultSnapshot),
        periode: selectedPeriode,
      });

      setAlert({
        type: "success",
        message: "Snapshot berhasil disimpan ke Firestore!",
        show: true,
      });
    } catch (error) {
      console.error("❌ Gagal menyimpan snapshot:", error);
      setAlert({
        type: "error",
        message: "Terjadi kesalahan saat menyimpan snapshot.",
        show: true,
      });
    }

    // Simpan ke Firestore? tinggal aktifkan:
    // await addDoc(collection(db, "riwayat_profile_matching"), resultSnapshot);
  };

  return (
    <div className="p-6 space-y-4">
      {/* Data Dosen */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Periode Dosen</h1>

        {loading ? (
          <p>Memuat data kriteria...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="mb-4">
                <Label className="block mb-1 text-sm text-gray-700">
                  Pilih Periode
                </Label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value)}
                >
                  <option value="">-- Pilih Periode --</option>
                  {periodeList.map((periode) => (
                    <option key={periode} value={periode}>
                      {periode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Kriteria */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Bobot Setiap Kriteria</h1>

        {loading ? (
          <p>Memuat data kriteria...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {kriteriaList.map((item, index) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 items-center">
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
        <>
          <div ref={resultsRef} className="print-area overflow-x-auto">
            <img
              src="/img/adzkia.png"
              alt=""
              className="watermark-print  hidden"
            />
            {/* HEADER */}
            <div className="header-print-area flex-col justify-center items-center mb-5 hidden ">
              <span className="text-xl font-semibold">
                LAPORAN PENILAIAN DOSEN
              </span>
              <span className="text-xl font-semibold">UNIVERSITAS ADZKIA</span>
            </div>
            <Table className="border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Dosen</TableHead>
                  <TableHead>Total Nilai</TableHead>
                  <TableHead className="print:hidden">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosenList
                  .sort((a, b) => b.total - a.total)
                  .map((d, i) => (
                    <TableRow key={d.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{d.nama}</TableCell>
                      <TableCell>{d.total.toFixed(2)}</TableCell>
                      <TableCell className="print:hidden">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDosen(d); // set full object DosenWithGap
                            setShowModal(true);
                          }}
                        >
                          DETAIL
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <div className="print-footer print:flex justify-between p-5 mt-10 hidden">
              <div>{""}</div>
              <div>{""}</div>
              <div className="flex flex-col gap-20">
                <div className="flex flex-col">
                  <span>Diketahui oleh, </span>
                  <span>Padang {new Date().toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}</span>
                </div>
                <div>
                  <span className="border-b-2">{"( Winda Nopriana, M.Pd )"}</span>
                  {/* <p className="mt-8">{new Date().toLocaleDateString()}</p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <Button onClick={SaveData} disabled={!hasProcessed}>
              <SaveIcon className="w-4 h-4" />
            </Button>
            <Button onClick={exportToCsv} disabled={!hasProcessed}>
              <FileDown className="w-4 h-4" />
            </Button>
            <Button onClick={printReport} disabled={!hasProcessed}>
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}

      {/* Detail Information */}
      {showModal && selectedDosen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-3xl w-full overflow-y-auto max-h-[90vh] shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              Detail Penilaian: {selectedDosen.nama}
            </h2>

            <div className="space-y-4 text-sm">
              {kriteriaList.map((kriteria) => {
                const relatedSubs = subkriteriaList.filter(
                  (s) => s.kriteriaId === kriteria.id
                );

                const core = relatedSubs.filter((s) => s.tipe === "Core");
                const secondary = relatedSubs.filter(
                  (s) => s.tipe === "Secondary"
                );

                const avgCore =
                  core.length > 0
                    ? core.reduce(
                        (sum, s) => sum + (selectedDosen.bobot[s.id] ?? 0),
                        0
                      ) / core.length
                    : 0;

                const avgSec =
                  secondary.length > 0
                    ? secondary.reduce(
                        (sum, s) => sum + (selectedDosen.bobot[s.id] ?? 0),
                        0
                      ) / secondary.length
                    : 0;

                const totalKriteria =
                  (kriteria.persentaseCore / 100) * avgCore +
                  (kriteria.persentaseSecondary / 100) * avgSec;

                const totalAkhir = totalKriteria * (kriteria.bobot / 100);

                return (
                  <div key={kriteria.id} className="border-b pb-4">
                    <h3 className="font-semibold text-blue-600 mb-2">
                      {kriteria.kriteria}
                    </h3>

                    <table className="w-full text-xs mb-2 border border-gray-300 dark:border-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="border px-2">Subkriteria</th>
                          <th className="border px-2">Nilai</th>
                          <th className="border px-2">Target</th>
                          <th className="border px-2">Gap</th>
                          <th className="border px-2">Bobot</th>
                          <th className="border px-2">Tipe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {relatedSubs.map((sub) => (
                          <tr key={sub.id}>
                            <td className="border px-2">{sub.subkriteria}</td>
                            <td className="border px-2">
                              {selectedDosen.nilai[sub.id] ?? "-"}
                            </td>
                            <td className="border px-2">{sub.nilaiTarget}</td>
                            <td className="border px-2">
                              {selectedDosen.gap[sub.id] ?? "-"}
                            </td>
                            <td className="border px-2">
                              {selectedDosen.bobot[sub.id]?.toFixed(2) ?? "-"}
                            </td>
                            <td className="border px-2">{sub.tipe}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p className="text-xs">
                      <strong>Rata-rata Core:</strong> {avgCore.toFixed(2)} |{" "}
                      <strong>Rata-rata Secondary:</strong> {avgSec.toFixed(2)}
                    </p>
                    <p className="text-xs">
                      <strong>Total Kriteria:</strong>{" "}
                      {totalKriteria.toFixed(2)} x <strong>Bobot:</strong>{" "}
                      {kriteria.bobot}% ={" "}
                      <strong className="text-green-600">
                        {totalAkhir.toFixed(2)}
                      </strong>
                    </p>
                  </div>
                );
              })}
              <div className="mt-6 text-right font-semibold text-lg">
                TOTAL NILAI AKHIR:{" "}
                <span className="text-blue-600">
                  {selectedDosen.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <CustomAlert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ProfileMatchingCalculation;
