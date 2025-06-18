"use client";
import { useEffect, useState } from "react";
import { getAllDosen } from "@/lib/firestore/dosen";
import { getAllSubkriteria } from "@/lib/firestore/sub-kriteria";
import { createPenilaian } from "@/lib/firestore/penilaian";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PenilaianInput {
  subkriteriaId: string;
  nilai: number;
}

const AddPenilaianPage = () => {
  const [dosenList, setDosenList] = useState<IDosen[]>([]);
  const [subList, setSubList] = useState<ISubKriteria[]>([]);
  const [dosenId, setDosenId] = useState("");
  const [inputs, setInputs] = useState<PenilaianInput[]>([
    { subkriteriaId: "", nilai: 0 },
  ]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const dosen = await getAllDosen();
      const sub = await getAllSubkriteria();
      setDosenList(dosen);
      setSubList(sub);
    };
    fetchData();
  }, []);

  const handleInputChange = (
    index: number,
    field: keyof PenilaianInput,
    value: string | number
  ) => {
    const newInputs = [...inputs];
    if (field === "nilai") {
      newInputs[index][field] = Number(value);
    } else {
      newInputs[index][field] = value as string;
    }
    setInputs(newInputs);
  };

  const addInputRow = () => {
    setInputs([...inputs, { subkriteriaId: "", nilai: 0 }]);
  };

  const removeInputRow = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dosenId) {
      alert("Pilih dosen terlebih dahulu");
      return;
    }
    for (const input of inputs) {
      if (!input.subkriteriaId || input.nilai <= 0) {
        alert("Semua field subkriteria dan nilai harus diisi dengan benar");
        return;
      }
    }

    // Create penilaian for each input
    for (const input of inputs) {
      await createPenilaian({
        dosenId,
        subkriteriaId: input.subkriteriaId,
        nilai: input.nilai,
      });
    }
    router.push("/penilaian"); // Redirect ke daftar penilaian
  };

  return (
    <div className="w-full mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tambah Penilaian</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <Label className="block mb-2 text-lg font-medium text-gray-700">
            Dosen
          </Label>
          <Select onValueChange={(value) => setDosenId(value)}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <SelectValue placeholder="Pilih Dosen" />
            </SelectTrigger>
            <SelectContent>
              {dosenList.map((dosen) => (
                <SelectItem key={dosen.id} value={dosen.id}>
                  {dosen.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2 ">
          {inputs.map((input, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div >
                  <Label className="block mb-2 text-sm font-medium text-gray-700">
                    Kriteria
                  </Label>
                  <Select
                    value={input.subkriteriaId}
                    onValueChange={(value) =>
                      handleInputChange(index, "subkriteriaId", value)
                    }
                  >
                    <SelectTrigger className="w-[100%] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Pilih Subkriteria" />
                    </SelectTrigger>
                    <SelectContent className="w-[50%]">
                      {subList.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.subkriteria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div >
                  <Label className="block mb-2 text-sm font-medium text-gray-700">
                    Subkriteria
                  </Label>
                  <Select
                    value={input.subkriteriaId}
                    onValueChange={(value) =>
                      handleInputChange(index, "subkriteriaId", value)
                    }
                  >
                    <SelectTrigger className="w-[100%] border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <SelectValue placeholder="Pilih Subkriteria" />
                    </SelectTrigger>
                    <SelectContent className="w-[50%]">
                      {subList.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.subkriteria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium text-gray-700">
                    Nilai
                  </Label>
                  {/* <Input
                    type="number"
                    value={input.nilai}
                    onChange={(e) =>
                      handleInputChange(index, "nilai", Number(e.target.value))
                    }
                    min={0}
                    max={100}
                    className="border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  /> */}
                  <Select
                    value={String(input.nilai)} // Convert number to string
                    onValueChange={(value) =>  handleInputChange(index, "nilai", Number(value))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Penilaian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Buruk</SelectItem>
                      <SelectItem value="2">Sedang</SelectItem>
                      <SelectItem value="3">Cukup</SelectItem>
                      <SelectItem value="4">Baik</SelectItem>
                      <SelectItem value="5">Sangat Baik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inputs.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeInputRow(index)}
                      className="mt-6"
                    >
                      Hapus
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button type="button" onClick={addInputRow} className="w-full mb-4">
          Tambah Subkriteria
        </Button>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md shadow-md transition duration-300"
        >
          Simpan Penilaian
        </Button>
      </form>
    </div>
  );
};

export default AddPenilaianPage;
