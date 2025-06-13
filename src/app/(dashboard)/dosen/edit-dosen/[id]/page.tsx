"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomAlert from "@/components/ui/CustomAlert";
import { getDosenById, updateDosen } from "@/lib/firestore/dosen"; // Pastikan sesuai path
import BackButton from "@/components/ui/BackButton";
import { useParams } from "next/navigation";

const EditDosenForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "lecture",
    status: "active",
    department: "",
    subjects: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          // Ambil data user berdasarkan id
          const dosenDoc = await getDosenById(id as string); // Pastikan getUserById mengembalikan data pengguna
          if (dosenDoc) {
            setFormData({
              name: dosenDoc.name || "",
              email: dosenDoc.email || "",
              role: dosenDoc.role || "lecture",
              status: dosenDoc.status || "active",
              department: dosenDoc.department || "",
              subjects: dosenDoc.subjects?.join(", ") || "",
              phone: dosenDoc.phone || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user: ", error);

          setAlert({
            type: "success",
            message: "Dosen Update successfully!",
            show: true,
          });
          setTimeout(
            () => setAlert((prev) => ({ ...prev, show: false })),
            3000
          );
        }
      };
      fetchUserData();
    }
    // Hide the alert after 3 seconds
  }, [id]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        department: formData.department,
        subjects: formData.subjects.split(",").map((s) => s.trim()),
        phone: formData.phone || undefined,
      };

      await updateDosen(id as string, updatedData);

      setAlert({
        type: "success",
        message: "Dosen updated successfully!",
        show: true,
      });

      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message: "Failed to update dosen.",
        show: true,
      });
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 md:px-10 py-10 bg-muted/40 flex flex-col justify-start items-start rounded-xl">
      <BackButton />
      <Card className="w-full shadow-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-primary tracking-tight">
            Edit Dosen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="text-sm font-medium mb-1 block">
                Nama
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-sm font-medium mb-1 block">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="text-sm font-medium mb-1 block"
              >
                Departemen
              </label>
              <Input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subjects */}
            <div>
              <label
                htmlFor="subjects"
                className="text-sm font-medium mb-1 block"
              >
                Mata Kuliah (pisahkan dengan koma)
              </label>
              <Input
                id="subjects"
                name="subjects"
                type="text"
                value={formData.subjects}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-sm font-medium mb-1 block">
                No. Telepon (opsional)
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="text-sm font-medium mb-1 block">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
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
              </select>
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium mb-1 block"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="non-active">Non-Active</option>
              </select>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <CustomAlert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default EditDosenForm;
