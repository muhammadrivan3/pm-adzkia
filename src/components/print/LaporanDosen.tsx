"use client";

import React, { forwardRef } from "react";

interface LaporanDosenProps {
  data: IDosen[];
}

const LaporanDosen = forwardRef<HTMLDivElement, LaporanDosenProps>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="p-6 font-sans text-black print:text-black">
        <h2 className="text-2xl font-bold text-center mb-6">
          Laporan Data Dosen
        </h2>

        <table className="w-full text-sm border border-collapse border-gray-700">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">Nama</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Jurusan</th>
              <th className="border px-2 py-1">Mata Kuliah</th>
              <th className="border px-2 py-1">No. HP</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="border px-2 py-2 text-center">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              data.map((dosen) => (
                <tr key={dosen.id} className="odd:bg-white even:bg-gray-100">
                  <td className="border px-2 py-1">{dosen.name}</td>
                  <td className="border px-2 py-1">{dosen.email}</td>
                  <td className="border px-2 py-1">{dosen.role}</td>
                  <td className="border px-2 py-1">{dosen.department}</td>
                  <td className="border px-2 py-1">{dosen.subjects}</td>
                  <td className="border px-2 py-1">{dosen.phone}</td>
                  <td className="border px-2 py-1 text-center">
                    {dosen.status === "active" ? "Aktif" : "Nonaktif"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-12 text-right pr-6">
          <p className="text-sm">Dicetak pada: {new Date().toLocaleDateString("id-ID")}</p>
        </div>
      </div>
    );
  }
);

LaporanDosen.displayName = "LaporanDosen";

export default LaporanDosen;
