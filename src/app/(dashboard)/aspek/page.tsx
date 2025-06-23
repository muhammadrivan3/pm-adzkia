"use client";

import React, { useEffect, useRef, useState } from "react";
import { deleteKriteria, getAllKriteria } from "@/lib/firestore/kriteria";
import {
  deleteSubkriteria,
  getSubkriteriaByKriteriaId,
} from "@/lib/firestore/sub-kriteria";
import { Card, CardContent } from "@/components/ui/card";
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
import Link from "next/link";
import { Edit, Plus, Printer, Trash } from "lucide-react";
import ActionModal from "@/components/ui/ActionModal";
import { useRouter } from "next/navigation";

// Tipe data Subkriteria lengkap
type SubkriteriaWithFullProps = ISubKriteria & {
  kriteriaId: string;
};

const AspekPage = () => {
  const router = useRouter();
  const [dataKriteria, setDataKriteria] = useState<IKriteria[]>([]);
  const [dataSubKriteria, setDataSubKriteria] = useState<
    (IKriteria & { subkriteria: SubkriteriaWithFullProps[] })[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "update" | null>(
    null
  );
  const [kriteriaIdToAction, setKriteriaIdToAction] = useState<string | null>(
    null
  );
  const [subKriteriaIdToAction, setSubKriteriaIdToAction] = useState<
    string | null
  >(null);
    const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kriteriaList = await getAllKriteria(); // Ambil kriteria dari firestore
        console.log(kriteriaList);
        const combined = await Promise.all(
          kriteriaList.map(async (kriteria: IKriteria) => {
            // Ambil subkriteria berdasarkan kode kriteria
            const subkriteria = await getSubkriteriaByKriteriaId(kriteria.id);

            // Gabungkan subkriteria dengan kriteria
            const fullSubkriteria = subkriteria.map((sub) => ({
              ...sub,
              kriteriaId: kriteria.kode, // Menambahkan kriteriaId
            }));

            return { ...kriteria, subkriteria: fullSubkriteria };
          })
        );
        setDataKriteria(kriteriaList);
        setDataSubKriteria(combined); // Update state dengan data yang sudah lengkap
        // console.log(dataKriteria);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataKriteria]);

  // Filter and search kriteria and subkriteria
  const filteredDataSubkriteria = dataSubKriteria
    .map((kriteria) => {
      const filteredSubkriteria = kriteria.subkriteria.filter((sub) =>
        sub.subkriteria.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (
        kriteria.kriteria.toLowerCase().includes(searchQuery.toLowerCase()) ||
        filteredSubkriteria.length > 0
      ) {
        return { ...kriteria, subkriteria: filteredSubkriteria };
      }
      return null;
    })
    .filter((item) => item !== null) as (IKriteria & {
      subkriteria: SubkriteriaWithFullProps[];
    })[];

  const filteredKriteria = dataKriteria.filter((kriteria) =>
    kriteria.kriteria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, item: string) => {
    if (id) {
      if (item === "kriteria") {
        await deleteKriteria(id); // Delete kriteria from Firestore
        setDataKriteria((prevdata) =>
          prevdata.filter((data) => data.id !== id)
        );
        // Also remove from dataSubKriteria
        setDataSubKriteria((prevdata) =>
          prevdata.filter((data) => data.id !== id)
        );
      } else if (item === "subKriteria") {
        await deleteSubkriteria(id); // Delete subkriteria from Firestore
        // Remove subkriteria from dataSubKriteria state
        setDataSubKriteria((prevdata) =>
          prevdata.map((kriteria) => ({
            ...kriteria,
            subkriteria: kriteria.subkriteria.filter((sub) => sub.id !== id),
          }))
        );
      }
    }
  };

  const handleUpdate = (id: string, item: string) => {
    if (id) {
      if (item === "kriteria") {
        router.push(`/aspek/edit-aspek/${id}`);
      } else if (item === "subKriteria") {
        router.push(`/aspek/edit-subaspek/${id}`);
      }
    }
  };

  const openModal = (
    id: string,
    action: "delete" | "update",
    message: string,
    item: string
  ) => {
    if (item === "kriteria") {
      setKriteriaIdToAction(id);
      setModalAction(action);
      setIsModalOpen(true);
      console.log("id Kriteria : ", id);
    } else if (item === "subKriteria") {
      console.log("id Sub-Kriteria : ", id);
      setSubKriteriaIdToAction(id);
      setModalAction(action);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setKriteriaIdToAction(null);
    setSubKriteriaIdToAction(null);
    setModalAction(null);
  };
  const printReport = () => {
    window.print(); // ✅ langsung panggil native dialog
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif border-b-2 pb-1 border-blue-500">
          Manajemen Aspek
        </h1>

        <div className="flex gap-2">
          <Button asChild className="gap-2">
            <Link href="/aspek/add-aspek">
              <Plus className="w-4 h-4" /> Tambah Aspek
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/aspek/add-subaspek">
              <Plus className="w-4 h-4" /> Tambah Sub-Aspek
            </Link>
          </Button>
           <Button className="gap-2" onClick={printReport}>
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search input */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Cari aspek atau sub-aspek..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[200px]"
        />
      </div>

      <div
        ref={printAreaRef}
        className="print-area relative rounded-b-xl overflow-hidden "
      >
        <img src="/img/adzkia.png" alt="" className="watermark-print  hidden" />
        {/* HEADER */}
        <div className="header-print-area flex-col justify-center items-center mb-5 hidden ">
          <span className="text-xl font-semibold">LAPORAN INFORMASI KRITERIA</span>
          <span className="text-xl font-semibold">UNIVERSITAS ADZKIA</span>
        </div>
        {/* Kriteria Only Table */}
        <div className="rounded-b-xl overflow-hidden border border-t-0 border-gray-200 dark:border-gray-700 shadow-lg mb-6 print:shadow-none print:border-none print:rounded-none">
          <Card >
            <CardContent>
              <Table>
                <TableCaption>
                  Laporan Informasi Kriteria
                </TableCaption>
                <TableHeader>
                  <TableRow >
                    <TableHead className="w-[100px]">Kode</TableHead>
                    <TableHead >Kriteria</TableHead>
                    <TableHead >Core (%)</TableHead>
                    <TableHead>Secondary (%)</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKriteria.map((kriteria) => (
                    <TableRow key={kriteria.kode}>
                      <TableCell>{kriteria.kode}</TableCell>
                      <TableCell>{kriteria.kriteria}</TableCell>
                      <TableCell className="text-start space-x-2">{kriteria.persentaseCore}</TableCell>
                      <TableCell className="text-start space-x-2">{kriteria.persentaseSecondary}</TableCell>
                      <TableCell className="text-start space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="px-2"
                          onClick={() =>
                            openModal(
                              kriteria.id,
                              "update",
                              "Anda yakin ingin mengubah kriteria ini?",
                              "kriteria"
                            )
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="px-2"
                          onClick={() =>
                            openModal(
                              kriteria.id,
                              "delete",
                              "Anda yakin ingin menghapus kriteria ini?",
                              "kriteria"
                            )
                          }
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

        {/* Sub Kriteria */}
        <div className="w-full rounded-b-xl overflow-hidden border border-t-0 border-gray-200 dark:border-gray-700 shadow-lg print:shadow-none print:border-none print:rounded-none">
          <Card>
            <CardContent>
              <Table>
                
                <TableCaption>
                  Laporan Informasi Sub-Kriteria
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Kode</TableHead>
                    <TableHead>Kriteria</TableHead>
                    <TableHead>Subkriteria</TableHead>
                    <TableHead>Nilai Target</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDataSubkriteria.map((kriteria) =>
                    kriteria.subkriteria.map((sub, idx) => (
                      <TableRow key={sub.kode}>
                        {idx === 0 ? (
                          <>
                            <TableCell rowSpan={kriteria.subkriteria.length}>
                              {kriteria.kode}
                            </TableCell>
                            <TableCell rowSpan={kriteria.subkriteria.length}>
                              {kriteria.kriteria}
                            </TableCell>
                          </>
                        ) : null}
                        <TableCell className="break-words whitespace-normal max-w-[50%]">{sub.subkriteria}</TableCell>
                        <TableCell>{sub.nilaiTarget}</TableCell>
                        <TableCell>{sub.tipe}</TableCell>
                        <TableCell className="text-start space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="px-2"
                            onClick={() =>
                              openModal(
                                sub.id,
                                "update",
                                "Anda yakin ingin mengubah subkriteria ini?",
                                "subKriteria"
                              )
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="px-2"
                            onClick={() =>
                              openModal(
                                sub.id,
                                "delete",
                                "Anda yaking ingin menghapus subkriteria ini?",
                                "subKriteria"
                              )
                            }
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        </div>

      {/* Modal Action */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {
          if (modalAction === "delete") {
            if (kriteriaIdToAction) {
    console.log("start delete");
              handleDelete(kriteriaIdToAction, "kriteria");
            } else if (subKriteriaIdToAction) {
              handleDelete(subKriteriaIdToAction, "subKriteria");
            }
          } else if (modalAction === "update") {
            if (kriteriaIdToAction) {
              handleUpdate(kriteriaIdToAction, "kriteria");
            } else if (subKriteriaIdToAction) {
              handleUpdate(subKriteriaIdToAction, "subKriteria");
            }
          }
          closeModal();
        }}
        title={modalAction === "delete" ? "Hapus item?" : "Update item?"}
        message={
          modalAction === "delete"
            ? "Apakah Anda yakin ingin menghapus item ini?"
            : "Apakah Anda yakin ingin memperbarui item ini?"
        }
        confirmText={modalAction === "delete" ? "Hapus" : "Update"}
        cancelText="Batal"
      />
    </div>
  );
};

export default AspekPage;
