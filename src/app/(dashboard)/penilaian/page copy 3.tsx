'use client'
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
import { Cpu, Plus, Trash } from "lucide-react";
import ActionModal from "@/components/ui/ActionModal";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

const PenilaianPage = () => {
  const router = useRouter();
  const [data, setData] = useState<
    (IPenilaian & { id?: string; dosenNama: string; subkriteriaNama: string })[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "update" | null>(null);
  const [penilaianIdToAction, setPenilaianIdToAction] = useState<string | null>();

  // State to track which dosen section is expanded or collapsed
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});


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
      (item.dosenNama?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (item.subkriteriaNama?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (item.nilai?.toString().includes(searchQuery) ?? false);

    return matchesSearch;
  });

  // Group filteredData by dosenNama
  const groupedData = filteredData.reduce((groups, item) => {
    const group = groups[item.dosenNama] || [];
    group.push(item);
    groups[item.dosenNama] = group;
    return groups;
  }, {} as Record<string, typeof filteredData>);

  // Toggle the visibility of the dosen section
  const toggleGroup = (dosenNama: string) => {
  setExpandedGroups((prev) => ({
    ...prev,
    [dosenNama]: !prev[dosenNama],
  }));
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
          {/* Export and print buttons */}
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

      <div className="rounded-b-xl overflow-hidden border border-t-0 border-gray-200 dark:border-gray-700 shadow-lg">
        <Card>
          <CardContent>
            <TableBody>
  {Object.entries(groupedData).map(([dosenNama, items]) => {
    const isExpanded = expandedGroups[dosenNama] ?? true;

    return (
      <React.Fragment key={dosenNama}>
        <TableRow
          onClick={() => toggleGroup(dosenNama)}
          className="bg-muted hover:bg-muted/80 cursor-pointer transition"
        >
          <TableCell colSpan={4} className="font-semibold text-base flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 shrink-0" />
            )}
            {dosenNama}
          </TableCell>
        </TableRow>

        {isExpanded &&
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell></TableCell>
              <TableCell>{item.subkriteriaNama}</TableCell>
              <TableCell>{item.nilai}</TableCell>
              <TableCell className="text-center space-x-2">
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
      </React.Fragment>
    );
  })}
</TableBody>

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
