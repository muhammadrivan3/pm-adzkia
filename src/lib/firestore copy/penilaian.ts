// lib/firestore/penilaian.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

// Struktur data penilaian
export interface Penilaian {
  id:string;
  dosenId: string;         // ID dosen yang dinilai
  subkriteriaId: string;   // ID subkriteria yang dinilai
  nilai: number;           // Nilai yang diberikan
}

// 🔸 Tambah Penilaian
export const createPenilaian = async (data: Penilaian) => {
  const ref = collection(db, "penilaian");
  const docRef = await addDoc(ref, data);
  return docRef.id;
};


// 🔸 Ambil Semua Penilaian
export const getAllPenilaian = async (): Promise<Penilaian[]> => {
  const snapshot = await getDocs(collection(db, "penilaian"));
  // const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Penilaian[];
};

// 🔸 Ambil Penilaian Berdasarkan Dosen ID
export const getPenilaianByDosen = async (dosenId: string) => {
  const ref = collection(db, "penilaian");
  const q = query(ref, where("dosenId", "==", dosenId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 🔸 Ambil Penilaian Berdasarkan Subkriteria ID
export const getPenilaianBySubkriteria = async (subkriteriaId: string) => {
  const ref = collection(db, "penilaian");
  const q = query(ref, where("subkriteriaId", "==", subkriteriaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 🔸 Update Penilaian
export const updatePenilaian = async (
  id: string,
  data: Partial<Penilaian>
) => {
  const ref = doc(db, "penilaian", id);
  await updateDoc(ref, data);
};

// 🔸 Hapus Penilaian
export const deletePenilaian = async (id: string) => {
  const ref = doc(db, "penilaian", id);
  await deleteDoc(ref);
};
