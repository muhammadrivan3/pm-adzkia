"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileDown, Plus, Printer, Trash } from "lucide-react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dosen = await getAllDosen();
        setDosenData(dosen);
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

  const filteredDosen = dosenData.filter((dosen) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      dosen.name?.toLowerCase().includes(q) ||
      dosen.email?.toLowerCase().includes(q) ||
      dosen.role?.toLowerCase().includes(q);
    const matchRole = roleFilter ? dosen.role === roleFilter : true;
    const matchStatus = statusFilter ? dosen.status === statusFilter : true;
    return matchSearch && matchRole && matchStatus;
  });

  const exportToCsv = () => {
    if (!filteredDosen.length) return setAlert({
          type: "info",
          message: "Tidak ada data untuk diekspor.",
          show: true,
        });
    const headers = ["Nama", "Email", "Role", "Jurusan", "Mata Kuliah", "No. Hp", "Status"];
    const rows = filteredDosen.map((d) => [
      d.name, d.email, d.role, d.department, d.subjects, d.phone, d.status,
    ]);
    const content = "data:text/csv;charset=utf-8," + [headers, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(content);
    link.download = "dosen_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <Button onClick={exportToCsv} disabled={!filteredDosen.length}>
            <FileDown className="w-4 h-4" />
          </Button>
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
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 rounded-md border bg-white dark:bg-gray-700">
          <option value="">Semua Role</option>
          <option value="dosen">Dosen</option>
          {/* dst */}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-md border bg-white dark:bg-gray-700">
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
        <img
          src="/img/adzkia.png"
          alt=""
          className="watermark-print  hidden"
        />
        {/* HEADER */}
        <div className="header-print-area flex-col justify-center items-center mb-5 hidden" >
          <span className="text-xl font-semibold">LAPORAN INFORMASI DOSEN</span>
          <span className="text-xl font-semibold">UNIVERSITAS ADZKIA</span>
        </div>
        <Table className="w-full">
          {/* <TableCaption>Daftar Dosen Terdaftar ok</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Jurusan</TableHead>
              <TableHead>Mata Kuliah</TableHead>
              <TableHead>No. Hp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="no-print text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDosen.map((dosen) => (
              <TableRow key={dosen.id}>
                <TableCell>{dosen.name}</TableCell>
                <TableCell>{dosen.email}</TableCell>
                <TableCell>{dosen.role}</TableCell>
                <TableCell>{dosen.department}</TableCell>
                <TableCell>{dosen.subjects}</TableCell>
                <TableCell>{dosen.phone}</TableCell>
                <TableCell>{dosen.status}</TableCell>
                <TableCell className="no-print text-center space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(dosen.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(dosen.id)}>
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
