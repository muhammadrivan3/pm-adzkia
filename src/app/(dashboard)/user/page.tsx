"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import { getAllUsers, deleteUser } from "@/lib/firestore/user"; // Import from your firestore helper
import ActionModal from "@/components/ui/ActionModal"; // Import the ActionModal component
import { useRouter } from "next/navigation";

const UserPage = () => {
  const router = useRouter(); // Initialize router for navigation
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"delete" | "update" | null>(null);
  const [userIdToAction, setUserIdToAction] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getAllUsers(); // Get users from Firestore
      setUsers(usersData);
    };
    fetchUsers();
  }, []); // Run once when component mounts

  const handleDelete = async (id: string) => {
    if (id) {
      await deleteUser(id); // Delete user from Firestore
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Update state after deletion
    }
  };

  const handleUpdate = (id: string) => {
    // console.log(`Update user with ID: ${id}`); // Handle update logic
    router.push(`/user/edit-user/${id}`);
  };

  const openModal = (id: string, action: "delete" | "update") => {
    setUserIdToAction(id);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserIdToAction(null);
    setModalAction(null);
  };

  return (
    <div className="w-full px-6 py-10 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif border-b-2 pb-1 border-blue-500">
          Manajemen Pengguna
        </h1>
        <Button asChild className="gap-2">
          <Link href="/user/add-user">
            <Plus className="w-4 h-4" /> Tambah User
          </Link>
        </Button>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
        <Table className="w-full">
          <TableCaption>Daftar pengguna aktif dan terdaftar.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <Button size="sm" variant="secondary" className="px-2" onClick={() => openModal(user.id, "update")}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="px-2"
                    onClick={() => openModal(user.id, "delete")}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Action */}
      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => {
          if (modalAction === "delete" && userIdToAction) {
            handleDelete(userIdToAction);
          } else if (modalAction === "update" && userIdToAction) {
            handleUpdate(userIdToAction);
          }
          closeModal();
        }}
        title={modalAction === "delete" ? "Hapus Pengguna?" : "Update Pengguna?"}
        message={
          modalAction === "delete"
            ? "Apakah Anda yakin ingin menghapus pengguna ini?"
            : "Apakah Anda yakin ingin memperbarui pengguna ini?"
        }
        confirmText={modalAction === "delete" ? "Hapus" : "Update"}
        cancelText="Batal"
      />
    </div>
  );
};

export default UserPage;
