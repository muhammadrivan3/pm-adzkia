"use client";

import React, { useEffect, useState } from "react";
import { deletePenilaian, getAllPenilaian } from "@/lib/firestore/penilaian";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cpu, Edit, Plus, Trash } from "lucide-react";
import ActionModal from "@/components/ui/ActionModal";
import { useRouter } from "next/navigation";

const PenilaianPage = () => {
  const router = useRouter();
  const [data, setData] = useState<
    (IPenilaian & { id?: string; dosenNama: string; subkriteriaNama: string })[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "update" | null>(null);
  const [penilaianIdToAction, setPenilaianIdToAction] = useState<string|null>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const penilaianList = await getAllPenilaian();
        const dosenList = await getAllDosen();
        const subkriteriaList = await getAllSubkriteria();

        const enriched = penilaianList.map((item: IPenilaian) => {
          const dosen = dosenList.find((d: IDosen) => d.id === item.dosenId);
          const sub = subkriteriaList.find(
            (s: ISubKriteria) => s.id === item.subkriteriaId
          );
          return {
            ...item,
            dosenNama: dosen?.name || "Tidak ditemukan",
            subkriteriaNama: sub?.subkriteria || "Tidak ditemukan",
          };
        });

        setData(enriched);
      } catch (error) {
        console.error("Gagal mengambil data penilaian:", error);
      }
    };

    fetchData();
  }, []);

 const handleDelete = async (id: string) => {
    if (id) {
      await deletePenilaian(id); // Delete user from Firestore
      setData((prevData) => prevData.filter((data) => data.id !== id)); // Update state after deletion
    }
  };

  const handleUpdate = (id: string) => {
    // console.log(`Update user with ID: ${id}`); // Handle update logic
    router.push(`/penilaian/edit-penilaian/${id}`);
  };
  const openModal = (id: string, action: "delete" | "update") => {
    setPenilaianIdToAction(id);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPenilaianIdToAction(null);
    setModalAction(null);
  };



  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif border-b-2 pb-1 border-blue-500">
          Manajemen Penilaian
        </h1>
        <div className="flex gap-2">
          <Button asChild className="gap-2">
            <Link href="/penilaian/add-penilaian">
              <Plus className="w-4 h-4" /> Tambah Penilaian
            </Link>
          </Button>

          <Button asChild className="gap-2">
            <Link href="/penilaian/pm">
              <Cpu className="w-4 h-4" /> Proses PM
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
        <Card>
          {/* <CardHeader>
            <CardTitle>Daftar Penilaian</CardTitle>
          </CardHeader> */}
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Dosen</TableHead>
                  <TableHead>Subkriteria</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.dosenNama}</TableCell>
                    <TableCell>{item.subkriteriaNama}</TableCell>
                    <TableCell>{item.nilai}</TableCell>
                    <TableCell className="text-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="px-2"
                    onClick={() => openModal(item.id ?? "default-id" , "update")}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="px-2"
                    onClick={() => openModal(item.id ?? "default-id", "delete")}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal Action */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {
          if (modalAction === "delete" && penilaianIdToAction) {
            handleDelete(penilaianIdToAction);
          } else if (modalAction === "update" && penilaianIdToAction) {
            handleUpdate(penilaianIdToAction);
          }
          closeModal();
        }}
        title={modalAction === "delete" ? "Hapus penilaian?" : "Update penilaian?"}
        message={
          modalAction === "delete"
            ? "Apakah Anda yakin ingin menghapus penilaian ini?"
            : "Apakah Anda yakin ingin memperbarui penilaian ini?"
        }
        confirmText={modalAction === "delete" ? "Hapus" : "Update"}
        cancelText="Batal"
      />
    </div>
  );
};

export default PenilaianPage;
