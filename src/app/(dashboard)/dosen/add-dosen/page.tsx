"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomAlert from "@/components/ui/CustomAlert";
import { createDosen } from "@/lib/firestore/dosen";
import BackButton from "@/components/ui/BackButton";

const DosenForm = () => {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "lecture",
    status: "active",
    department: "",
    subjects: "",
    phone: "",
  });
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
    // setLoading(true);
    // setError(null);

    try {
      const { name, email, role, status, department, subjects, phone } =
        formData;
      const dosenData = {
        name,
        email,
        role,
        status,
        department,
        subjects: subjects.split(",").map((s) => s.trim()),
        phone,
      };

      const dosenId = await createDosen(dosenData);
      // console.log(`Dosen created with ID: ${dosenId}`);

      setAlert({
        type: "success",
        message: "Dosen added successfully!",
        show: true,
      });

      setFormData({
        name: "",
        email: "",
        role: "lecture",
        status: "active",
        department: "",
        subjects: "",
        phone: "",
      });

      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
    } catch (error) {
      // setError("Failed to create dosen. Please try again.");
      console.error(error);
      setAlert({
        type: "error",
        message: "Failed to add dosen. Please try again.",
        show: true,
      });
      setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
    }
  };

  return (
    <div className="w-full min-h-screen px-4 md:px-10 py-10 bg-muted/40 flex flex-col justify-start items-start rounded-xl">
      <BackButton />
      <Card className="w-full shadow-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-primary tracking-tight">
            Tambah Dosen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label
                htmlFor="department"
                className="text-sm font-medium mb-1 block"
              >
                Jurusan
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

            <div>
              <label htmlFor="phone" className="text-sm font-medium mb-1 block">
                Nomor Telepon
              </label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="text-sm font-medium mb-1 block">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="non-active">Non-Active</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              Tambah Dosen
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

export default DosenForm;
