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
    nama: "",
    email: "",
    status: "active",
    phone: "",
    jabatan: jabatanList,
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
    show: boolean;
  }>({
    type: "success",
    message: "",
    show: false,
  });
  //   useEffect(() => {
  //   setFormData((prev) => ({ ...prev, jabatan: jabatanList }));
  // }, [jabatanList]);

  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          // Ambil data user berdasarkan id
          const dosenDoc = await getDosenById(id as string); // Pastikan getUserById mengembalikan data pengguna
          if (dosenDoc) {
            // const cleanedJabatan = dosenDoc.jabatan.map(
            //   (j: IJabatanPeriode) => ({
            //     ...j,
            //     mataDiampu: (j.mataDiampu || []).join(", "),
            //   })
            // );
            setJabatanList(dosenDoc.jabatan);
            setFormData({
              nama: dosenDoc.nama || "",
              email: dosenDoc.email || "",
              status: dosenDoc.status || "active",
              phone: dosenDoc.phone || "",
              jabatan: dosenDoc.jabatan || [],
            });
          }
        } catch (error) {
          console.error("Error fetching user: ", error);

          setAlert({
            type: "warning",
            message: "Terjadi kesalahan saat mengambil pengguna!",
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
      // const cleanJabatan = formData.jabatan.map((j) => ({
      //   ...j,
      //   mataDiampu: j.mataDiampu
      //     .flatMap((s) => s.split(","))
      //     .map((s) => s.trim())
      //     .filter((s) => s !== ""),
      // }));
      // const cleanJabatan = formData.jabatan.map((j) => ({
      //   ...j,
      //   mataDiampu: j.mataDiampu
      //     .split(",") // karena ini string
      //     .map((s) => s.trim())
      //     .filter((s) => s !== ""),
      // }));
      const cleanJabatan = jabatanList.map((j) => ({
        ...j,
        mataDiampu: j.mataDiampu
          .flatMap((s) => s.split(","))
          .map((s) => s.trim())
          .filter((s) => s !== ""),
      }));

      const updatedData = {
        nama: formData.nama,
        email: formData.email,
        status: formData.status,
        phone: formData.phone || undefined,
        jabatan: cleanJabatan,
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
                id="nama"
                name="nama"
                type="text"
                value={formData.nama}
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
                            i === index ? { ...j, nama: e.target.value } : j
                          )
                        )
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="dosen">Dosen</option>
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
                      value={jabatan.mataDiampu}
                      onChange={(e) =>
                        setJabatanList((prev) =>
                          prev.map((j, i) =>
                            i === index
                              ? {
                                  ...j,
                                  mataDiampu: e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter((s) => s !== ""),
                                }
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
