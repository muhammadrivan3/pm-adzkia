"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react"; // Mengambil data dari Firestore
import { deleteDosen, getAllDosen } from "@/lib/firestore/dosen";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DosenPage = () => {
  const router = useRouter();
  const [dosenData, setDosenData] = useState<IDosen[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Ambil data dosen dari Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dosen = await getAllDosen(); // Mengambil data dosen atau user lainnya
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
      await deleteDosen(id); // Delete user from Firestore
      setDosenData((prevUsers) => prevUsers.filter((dosen) => dosen.id !== id)); // Update state after deletion
    }
  };

  // Filter and search dosen
  const filteredDosen = dosenData.filter((dosen) => {
    const matchesSearch =
      (dosen.name?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (dosen.email?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (dosen.role?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesRole = roleFilter ? dosen.role === roleFilter : true;
    const matchesStatus = statusFilter ? dosen.status === statusFilter : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif border-b-2 pb-1 border-blue-500">
          Manajemen Dosen
        </h1>
        <Button asChild className="gap-2">
          <Link href="/dosen/add-dosen">
            <Plus className="w-4 h-4" /> Tambah Dosen
          </Link>
        </Button>
      </div>
      {/* Search and filter inputs */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Cari dosen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[200px]"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Role</option>
          <option value="dosen">Dosen</option>
          <option value="asdos">Asisten Dosen</option>
          <option value="staff">Staff TU</option>
          <option value="keuangan">Staff Keuangan</option>
          <option value="it">Staff IT</option>
          <option value="perpustakaan">Pustakawan</option>
          <option value="kemahasiswaan">Bagian Kemahasiswaan</option>
          <option value="security">Security</option>
          <option value="laboran">Teknisi Lab</option>
          <option value="humas">Humas</option>
          {/* Add other roles as needed */}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          {/* Add other statuses as needed */}
        </select>
      </div>
      {/* Table for displaying the dosen */}
      <div className="rounded-b-xl overflow-hidden border border-t-0 border-gray-200 dark:border-gray-700 shadow-lg">
        <Table className="w-full">
          <TableCaption>Daftar Dosen Terdaftar</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Jurusan</TableHead>
              <TableHead>Mata Kuliah</TableHead>
              <TableHead>No. Hp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
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
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      dosen.status === "active"
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {dosen.status}
                  </span>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="px-2"
                    onClick={() => handleEdit(dosen.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="px-2"
                    onClick={() => handleDelete(dosen.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DosenPage;
