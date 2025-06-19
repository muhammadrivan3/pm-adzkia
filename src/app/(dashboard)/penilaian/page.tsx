"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { deletePenilaian, getAllPenilaian } from "@/lib/firestore/penilaian";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
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
import { Cpu, FileDown, Plus, Printer, Trash } from "lucide-react";
import ActionModal from "@/components/ui/ActionModal";
import { useRouter } from "next/navigation";
import { getAllKriteria } from "@/lib/firestore/kriteria";

const PenilaianPage = () => {
  const router = useRouter();
  const [data, setData] = useState<
    (IPenilaian & {
      id?: string;
      dosenNama: string;
      subkriteriaNama: string;
      kriteriaNama: string;
    })[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "update" | null>(
    null
  );
  const [penilaianIdToAction, setPenilaianIdToAction] = useState<
    string | null
  >();

  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const penilaianList = await getAllPenilaian();
        const dosenList = await getAllDosen();
        const subkriteriaList = await getAllSubkriteria();
        const kriteriaList = await getAllKriteria();

        const enriched = penilaianList.map((item: IPenilaian) => {
          const dosen = dosenList.find((d: IDosen) => d.id === item.dosenId);
          const sub = subkriteriaList.find(
            (s: ISubKriteria) => s.id === item.subkriteriaId
          );
          const kriteria = kriteriaList.find(
            (k: IKriteria) => k.id === sub?.kriteriaId
          );
          return {
            ...item,
            dosenNama: dosen?.name || "Tidak ditemukan",
            kriteriaNama: kriteria?.kriteria || "Tidak ditemukan",
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

  // Filter and search penilaian
  const filteredData = data.filter((item) => {
    const matchesSearch =
      (item.dosenNama?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false) ||
      (item.subkriteriaNama
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false) ||
      (item.nilai?.toString().includes(searchQuery) ?? false);

    return matchesSearch;
  });

  // Group filteredData by dosenNama
  // const groupedData = filteredData.reduce((groups, item) => {
  //   const group = groups[item.dosenNama] || [];
  //   group.push(item);
  //   groups[item.dosenNama] = group;
  //   return groups;
  // }, {} as Record<string, typeof filteredData>);
  const [hiddenDosen, setHiddenDosen] = useState<Record<string, boolean>>({});
  const [hiddenKriteria, setHiddenKriteria] = useState<
    Record<string, Record<string, boolean>>
  >({});

  // With Memo
  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      if (!acc[item.dosenNama]) acc[item.dosenNama] = {};
      if (!acc[item.dosenNama][item.kriteriaNama])
        acc[item.dosenNama][item.kriteriaNama] = [];
      acc[item.dosenNama][item.kriteriaNama].push(item);
      return acc;
    }, {} as Record<string, Record<string, typeof filteredData>>);
  }, [filteredData]);

  // Without memo
  // const groupedData = filteredData.reduce((acc, item) => {
  //   if (!acc[item.dosenNama]) acc[item.dosenNama] = {};
  //   if (!acc[item.dosenNama][item.kriteriaNama])
  //     acc[item.dosenNama][item.kriteriaNama] = [];
  //   acc[item.dosenNama][item.kriteriaNama].push(item);
  //   return acc;
  // }, {} as Record<string, Record<string, typeof filteredData>>);

  const toggleDosen = (dosenNama: string) => {
    setHiddenDosen((prev) => ({ ...prev, [dosenNama]: !prev[dosenNama] }));
  };

  const toggleKriteria = (dosenNama: string, kriteriaNama: string) => {
    setHiddenKriteria((prev) => ({
      ...prev,
      [dosenNama]: {
        ...(prev[dosenNama] || {}),
        [kriteriaNama]: !prev[dosenNama]?.[kriteriaNama],
      },
    }));
  };
  const printReport = () => {
    window.print(); // ✅ langsung panggil native dialog
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

          <Button
            className="gap-2"
            onClick={() => {
              // Export filtered data to CSV
              const headers = [
                "Nama Dosen",
                "Kriteria",
                "Subkriteria",
                "Nilai",
              ];
              const rows: string[][] = [];

              Object.entries(groupedData).forEach(
                ([dosenNama, kriteriaGroup]) => {
                  Object.entries(kriteriaGroup).forEach(
                    ([kriteriaNama, itemList]) => {
                      itemList.forEach((item) => {
                        rows.push([
                          dosenNama,
                          kriteriaNama,
                          item.subkriteriaNama,
                          item.nilai.toString(),
                        ]);
                      });
                    }
                  );
                }
              );

              const csvContent =
                "data:text/csv;charset=utf-8," +
                [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "penilaian_report.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <FileDown className="w-4 h-4" />
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
          placeholder="Cari dosen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[200px]"
        />
      </div>

      <div
        ref={printAreaRef}
        className="print-area relative rounded-b-xl overflow-hidden border border-gray-300 dark:border-gray-700 "
      >
        <img src="/img/adzkia.png" alt="" className="watermark-print  hidden" />
        {/* HEADER */}
        <div className="header-print-area flex-col justify-center items-center mb-5 hidden ">
          <span className="text-xl font-semibold">LAPORAN INFORMASI DOSEN</span>
          <span className="text-xl font-semibold">UNIVERSITAS ADZKIA</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Dosen</TableHead>
              <TableHead>Kriteria</TableHead>
              <TableHead>Subkriteria</TableHead>
              <TableHead>Nilai</TableHead>
              <TableHead className="text-center print:hidden">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(groupedData).map(([dosenNama, kriteriaGroup]) => (
              <React.Fragment key={dosenNama}>
                {/* Header Dosen */}
                <TableRow className="bg-blue-100 dark:bg-blue-900 font-bold">
                  <TableCell colSpan={4}>
                    <button
                      onClick={() => toggleDosen(dosenNama)}
                      className="hover:underline text-left"
                    >
                      {hiddenDosen[dosenNama] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 inline-block mr-1 print:hidden"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 inline-block mr-1 print:hidden"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      )}
                      {dosenNama}
                    </button>
                  </TableCell>
                  <TableCell className="text-center border-2 print:hidden">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="px-2"
                      // onClick={() =>
                      //   openModal(item.id ?? "default-id", "delete")
                      // }
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>

                {!hiddenDosen[dosenNama] &&
                  Object.entries(kriteriaGroup).map(
                    ([kriteriaNama, penilaians]) => (
                      <React.Fragment key={kriteriaNama}>
                        <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold italic print:bg-none">
                          <TableCell></TableCell>
                          <TableCell colSpan={3}>
                            <button
                              onClick={() =>
                                toggleKriteria(dosenNama, kriteriaNama)
                              }
                              className="hover:underline text-left"
                            >
                              {hiddenKriteria[dosenNama]?.[kriteriaNama] ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5 inline-block mr-1 print:hidden"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5 inline-block mr-1 print:hidden"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="18 15 12 9 6 15" />
                                </svg>
                              )}{" "}
                              {kriteriaNama}
                            </button>
                          </TableCell>
                          <TableCell className="text-center border-2 print:hidden">
                            <Button
                              size="sm"
                              variant="destructive"
                              className="px-2"
                              // onClick={() =>
                              //   openModal(item.id ?? "default-id", "delete")
                              // }
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>

                        {!hiddenKriteria[dosenNama]?.[kriteriaNama] &&
                          penilaians.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell className="break-words whitespace-normal max-w-[150px] border-2">
                                {item.subkriteriaNama}
                              </TableCell>
                              <TableCell className="border-2 text-center">
                                {item.nilai}
                              </TableCell>
                              <TableCell className="text-center border-2 print:hidden">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="px-2"
                                  onClick={() =>
                                    openModal(item.id ?? "default-id", "delete")
                                  }
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </React.Fragment>
                    )
                  )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
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
        title={
          modalAction === "delete" ? "Hapus penilaian?" : "Update penilaian?"
        }
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
