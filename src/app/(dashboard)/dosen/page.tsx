"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit,  Plus, Printer, Trash } from "lucide-react";
import { deleteDosen, getAllDosen } from "@/lib/firestore/dosen";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomAlert from "@/components/ui/CustomAlert";

const DosenPage = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  const router = useRouter();
  const [dosenData, setDosenData] = useState<IDosen[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const printAreaRef = useRef<HTMLDivElement>(null);
  const [periodeFilter, setPeriodeFilter] = useState("");
  const [periodeList, setPeriodeList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dosen = await getAllDosen();
        setDosenData(dosen);
        // Ambil semua periode unik
        const periodeSet = new Set<string>();
        dosen.forEach((d) =>
          d.jabatan.forEach((j) => periodeSet.add(j.periode))
        );
        setPeriodeList(Array.from(periodeSet).sort());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/dosen/edit-dosen/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (id) {
      await deleteDosen(id);
      setDosenData((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const filteredDosen = useMemo(() => {
    return dosenData.filter((dosen) => {
      const q = searchQuery.toLowerCase();

      const matchSearch =
        dosen.nama?.toLowerCase().includes(q) ||
        dosen.email?.toLowerCase().includes(q);

      const matchStatus = statusFilter ? dosen.status === statusFilter : true;

      const matchPeriode = periodeFilter
        ? dosen.jabatan.some((j) => j.periode === periodeFilter)
        : true;

      return matchSearch && matchStatus && matchPeriode;
    });
  }, [searchQuery, statusFilter, periodeFilter, dosenData]);

  // const exportToCsv = () => {
  //   if (!filteredDosen.length)
  //     return setAlert({
  //       type: "info",
  //       message: "Tidak ada data untuk diekspor.",
  //       show: true,
  //     });
  //   const headers = [
  //     "Nama",
  //     "Email",
  //     "Role",
  //     "Jurusan",
  //     "Mata Kuliah",
  //     "No. Hp",
  //     "Status",
  //   ];
  //   const rows = filteredDosen.map((d) => [
  //     d.nama,
  //     d.email,
  //     d.jabatan,
  //     d.phone,
  //     d.status,
  //   ]);
  //   const content =
  //     "data:text/csv;charset=utf-8," +
  //     [headers, ...rows].map((e) => e.join(",")).join("\n");
  //   const link = document.createElement("a");
  //   link.href = encodeURI(content);
  //   link.download = "dosen_report.csv";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const printReport = () => {
    window.print(); // ✅ langsung panggil native dialog
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      {/* No-print Area */}
      <div className="no-print flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif border-b-2 pb-1 border-blue-500">
          Manajemen Dosen
        </h1>
        <div className="flex gap-2">
          <Button asChild className="gap-2">
            <Link href="/dosen/add-dosen">
              <Plus className="w-4 h-4" /> Tambah Dosen
            </Link>
          </Button>
          {/* <Button onClick={exportToCsv} disabled={!filteredDosen.length}>
            <FileDown className="w-4 h-4" />
          </Button> */}
          <Button onClick={printReport} disabled={!filteredDosen.length}>
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter - No print */}
      <div className="no-print flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-t-xl border border-b-0 border-gray-300 dark:border-gray-700">
        <input
          type="text"
          placeholder="Cari dosen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-md border bg-white dark:bg-gray-700 flex-grow min-w-[200px]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-md border bg-white dark:bg-gray-700"
        >
          <option value="">Semua Role</option>
          <option value="dosen">Dosen</option>
          {/* dst */}
        </select>
        <select
          value={periodeFilter}
          onChange={(e) => setPeriodeFilter(e.target.value)}
          className="px-3 py-2 rounded-md border bg-white dark:bg-gray-700"
        >
          <option value="">Semua Periode</option>
          {periodeList.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border bg-white dark:bg-gray-700"
        >
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Print Area */}
      <div
        ref={printAreaRef}
        className="print-area relative rounded-b-xl overflow-hidden border border-gray-300 dark:border-gray-700 "
      >
        <img src="/img/adzkia.png" alt="" className="watermark-print  hidden" />
        {/* HEADER */}
        <div className="header-print-area flex-col justify-center items-center mb-5 hidden">
          <span className="text-xl font-semibold">LAPORAN INFORMASI DOSEN</span>
          <span className="text-xl font-semibold">UNIVERSITAS ADZKIA</span>
        </div>
        <Table className="w-full ">
          <TableHeader>
            <TableRow className="[&>th]:border-2 text-sm text-center">
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No. Hp</TableHead>
              <TableHead className="text-center">
                <span>Jabatan</span>
                <div className="w-full grid grid-cols-2 gap-2 mt-1 text-xs">
                  <span>N. Jabatan</span>
                  <span className="border-l-2">Periode</span>
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="no-print text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredDosen.map((dosen) => (
              <TableRow key={dosen.id} className="[&>td]:border-2 text-sm">
                <TableCell>{dosen.nama}</TableCell>
                <TableCell>{dosen.email}</TableCell>
                <TableCell>{dosen.phone}</TableCell>
                <TableCell>
                  <div className="divide-y divide-border print:divide-y print:divide-border">
                    {dosen.jabatan.map((it, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-2 gap-2 py-2 text-sm"
                      >
                        <div className="text-left">{it.nama}</div>
                        <div className="text-left border-l pl-2">
                          {it.periode}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>

                <TableCell>{dosen.status}</TableCell>
                <TableCell className="no-print text-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(dosen.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(dosen.id)}
                  >
                    <Trash className="w-4 h-4" />
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
            <div>
              <span>Diketahui oleh,</span>
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
      <CustomAlert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default DosenPage;
