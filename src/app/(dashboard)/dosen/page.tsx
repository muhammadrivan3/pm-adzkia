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
import { Edit, Trash } from "lucide-react"; // Mengambil data dari Firestore
import { deleteDosen, getAllDosen } from "@/lib/firestore/dosen";
import { useRouter } from "next/navigation";

const DosenPage = () => {
  const router = useRouter();
  const [dosenData, setDosenData] = useState<any[]>([]);

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
    // console.log(`Edit user with ID: ${id}`); // Logic untuk mengedit dosen
    // Arahkan ke halaman edit
    router.push(`/dosen/edit-dosen/${id}`);
  };

  const handleDelete = async (id: string) => {
    // const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    // if (confirmDelete) {
    //   console.log(`Deleting user with ID: ${id}`);
    //   // Panggil fungsi delete dari firestore
    // }
    if (id) {
      await deleteDosen(id); // Delete user from Firestore
      setDosenData((prevUsers) => prevUsers.filter((dosen) => dosen.id !== id)); // Update state after deletion
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-semibold mb-4">Halaman Dosen</h1>

      {/* Button to add a new user */}
      <Button asChild className="mb-4">
        <a href="/dosen/add-dosen" className="flex items-center gap-2">
          <Edit className="w-4 h-4" /> Tambah Dosen
        </a>
      </Button>

      {/* Table for displaying the users */}
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
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
            {dosenData.map((dosen) => (
              <TableRow key={dosen.id}>
                <TableCell>{dosen.name}</TableCell>
                <TableCell>{dosen.email}</TableCell>
                <TableCell>{dosen.role}</TableCell>
                <TableCell>{dosen.department}</TableCell>
                <TableCell>{dosen.subjects}</TableCell>
                <TableCell>{dosen.phone}</TableCell>
                {/* <TableCell>{dosen.status}</TableCell> */}
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
