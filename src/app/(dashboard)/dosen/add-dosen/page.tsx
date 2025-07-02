"use client";

import React, { useEffect, useState } from "react";
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

  const [jabatanList, setJabatanList] = useState<IJabatanPeriode[]>([
    {
      nama: "",
      departemen: "",
      mataDiampu: [],
      periode: "",
      mulai: "",
      akhir: "",
    },
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
    phone: "",
    jabatan: jabatanList,
  });
  useEffect(() => {
    setFormData((prev) => ({ ...prev, jabatan: jabatanList }));
  }, [jabatanList]);
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
      const { name, email, status, phone, jabatan } = formData;
      const cleanJabatan = jabatan.map((j) => ({
        ...j,
        mataDiampu: j.mataDiampu
          .flatMap((s) => s.split(","))
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      }));
      const dosenData = {
        name,
        email,
        status,
        phone,
        jabatan: cleanJabatan,
      };

      await createDosen(dosenData);

      setAlert({
        type: "success",
        message: "Dosen added successfully!",
        show: true,
      });

      setFormData({
        name: "",
        email: "",
        status: "active",
        phone: "",
        jabatan: [],
      });
      setJabatanList([]);

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

            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-3 ">
                Riwayat Periode Jabatan
              </p>

              {jabatanList.map((jabatan, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3"
                >
                  <div>
                    <label
                      htmlFor="subjects"
                      className="text-sm font-medium mb-1 block text-muted-foreground"
                    >
                      Jabatan
                    </label>
                    <select
                      id="jabatanNama"
                      name="jabatanNama"
                      value={jabatan.nama}
                      onChange={(e) =>
                        setJabatanList((prev) =>
                          prev.map((j, i) =>
                            i === index
                              ? { ...j, nama: e.target.value }
                              : j
                          )
                        )
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="dosen" selected>Dosen</option>
                      <option value="asdos">Asisten Dosen</option>
                      <option value="staff">Staff TU</option>
                      <option value="keuangan">Staff Keuangan</option>
                      <option value="it">Staff IT</option>
                      <option value="perpustakaan">Pustakawan</option>
                      <option value="kemahasiswaan">
                        Bagian Kemahasiswaan
                      </option>
                      <option value="security">Security</option>
                      <option value="laboran">Teknisi Lab</option>
                      <option value="humas">Humas</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="department"
                      className="text-sm font-medium mb-1 block text-muted-foreground"
                    >
                      Jurusan
                    </label>
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      value={jabatan.departemen}
                      onChange={(e) =>
                        setJabatanList((prev) =>
                          prev.map((j, i) =>
                            i === index
                              ? { ...j, departemen: e.target.value }
                              : j
                          )
                        )
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subjects"
                      className="text-sm font-medium mb-1 block text-muted-foreground"
                    >
                      Mata Kuliah (pisahkan dengan koma)
                    </label>
                    <Input
                      id="subjects"
                      name="subjects"
                      type="text"
                      value={jabatan.mataDiampu.join(", ")}
                      onChange={(e) =>
                        setJabatanList((prev) =>
                          prev.map((j, i) =>
                            i === index
                              ? { ...j, mataDiampu: [e.target.value] }
                              : j
                          )
                        )
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subjects"
                      className="text-sm font-medium mb-1 block text-muted-foreground"
                    >
                      Periode
                    </label>
                    <Input
                      type="text"
                      placeholder="Periode (misal 2024-2026)"
                      value={jabatan.periode}
                      onChange={(e) =>
                        setJabatanList((prev) =>
                          prev.map((j, i) =>
                            i === index ? { ...j, periode: e.target.value } : j
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subjects"
                      className="text-sm font-medium mb-1 block text-muted-foreground"
                    >
                      Mulai
                    </label>
                    <Input
                      type="date"
                      placeholder="Mulai Jabatan"
                      value={jabatan.mulai}
                      onChange={(e) =>
                        setJabatanList((prev) =>
                          prev.map((j, i) =>
                            i === index ? { ...j, mulai: e.target.value } : j
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subjects"
                      className="text-sm font-medium mb-1 block text-muted-foreground"
                    >
                      Akhir
                    </label>
                  <Input
                      type="date"
                      placeholder="Akhir Jabatan"
                      value={jabatan.akhir}
                      onChange={(e) =>
                        setJabatanList((prev) =>
                          prev.map((j, i) =>
                            i === index ? { ...j, akhir: e.target.value } : j
                          )
                        )
                      }
                    />
                    </div>
                  <div className="flex gap-2">
                    {jabatanList.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() =>
                          setJabatanList((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setJabatanList((prev) => [
                    ...prev,
                    {
                      nama: "",
                      departemen: "",
                      mataDiampu: [],
                      periode: "",
                      mulai: "",
                      akhir: "",
                    },
                  ])
                }
                className="mt-2"
              >
                + Tambah Jabatan
              </Button>
            </div>

            {/* <div>
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
            </div> */}

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
