/* eslint-disable */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
interface SnapshotModalProps {
  show: boolean;
  onClose: () => void;
  data: any;
}

const SnapshotModal: React.FC<SnapshotModalProps> = ({
  show,
  onClose,
  data,
}) => {
  if (!show || !data) return null;

  // const handlePrint = () => {
  //   const printWindow = window.open("", "_blank");
  //   if (!printWindow) return;

  //   const style = `
  //     <style>
  //       body { font-family: sans-serif; padding: 20px; }
  //       table { width: 100%; border-collapse: collapse; margin-top: 1rem }
  //       th, td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 12px; }
  //       th { background-color: #f3f3f3; }
  //       h2, h3 { margin-top: 1rem; }
  //     </style>
  //   `;

  //   const html = `
  //     <html>
  //       <head><title>Snapshot Detail</title>${style}</head>
  //       <body>
  //         <h2>Riwayat Snapshot Penilaian</h2>
  //         <p><strong>Periode:</strong> ${data.periode}</p>
  //         <p><strong>Waktu Simpan:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
  //         <h3>Daftar Penilaian</h3>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>No</th>
  //               <th>Nama Dosen</th>
  //               <th>Total Nilai</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${data.data
  //               .map(
  //                 (d: any) => `
  //               <tr>
  //                 <td>${d.no}</td>
  //                 <td>${d.nama}</td>
  //                 <td>${d.total.toFixed(2)}</td>
  //               </tr>`
  //               )
  //               .join("")}
  //           </tbody>
  //         </table>
  //       </body>
  //     </html>
  //   `;

  //   printWindow.document.write(html);
  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  // };
  const handleExportJSON = () => {
    const filename = `snapshot-${data.periode}-${new Date(
      data.timestamp
    ).toISOString()}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.data.map((d: any) => ({
        No: d.no,
        Nama: d.nama,
        Total: d.total,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penilaian");

    XLSX.writeFile(workbook, `snapshot-${data.periode}.xlsx`);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-3xl w-full overflow-y-auto max-h-[90vh] shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">Detail Snapshot Penilaian</h2>

        <div className="space-y-2 text-sm mb-4">
          <p>
            <strong>Periode:</strong> {data.periode}
          </p>
          <p>
            <strong>Waktu Simpan:</strong>{" "}
            {new Date(data.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-xs border border-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border px-2">No</th>
                <th className="border px-2">Nama Dosen</th>
                <th className="border px-2">Total Nilai</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item: any) => (
                <tr key={item.no}>
                  <td className="border px-2">{item.no}</td>
                  <td className="border px-2">{item.nama}</td>
                  <td className="border px-2">{item.total ?? "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={handleExportJSON}>
            Export JSON
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default SnapshotModal;
