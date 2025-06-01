// lib/firestore/subkriteria.ts
import { db } from "../firebase"; 
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
  DocumentData,
} from "firebase/firestore";

// Tipe data untuk Subkriteria
export interface Subkriteria {
  kriteriaId: string;       // ID dari kriteria utama
  subkriteria: string;      // Nama sub subject (contoh: Komunikasi Verbal)
  nilaiTarget: number;      // Target nilai untuk subkriteria ini
  kode: string;             // Kode unik subkriteria (contoh: SK001)
  tipe: "Core" | "Secondary";  // Tipe subkriteria
}

// Fungsi untuk menambah Subkriteria
export const createSubkriteria = async (data: Subkriteria) => {
  const ref = collection(db, "subkriteria");
  const docRef = await addDoc(ref, data);
  return docRef.id;
};
export interface SubkriteriaP {
  id: string;
  subkriteria: string;
  kriteriaId: string;
  nilaiTarget: number;
  kode: string;
  tipe: "Core" | "Secondary";
}

export const getAllSubkriteria = async (): Promise<SubkriteriaP[]> => {
  const snapshot = await getDocs(collection(db, "subkriteria"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SubkriteriaP[];
};

// Fungsi untuk mengambil semua Subkriteria berdasarkan Kriteria ID
export const getSubkriteriaByKriteriaId = async (kriteriaId: string): Promise<Subkriteria[]> => {
  const ref = collection(db, "subkriteria");
  const q = query(ref, where("kriteriaId", "==", kriteriaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Subkriteria);
};

// Fungsi untuk update Subkriteria
export const updateSubkriteria = async (
  id: string,
  data: Partial<Subkriteria>
) => {
  const ref = doc(db, "subkriteria", id);
  await updateDoc(ref, data);
};

// Fungsi untuk delete Subkriteria
export const deleteSubkriteria = async (id: string) => {
  const ref = doc(db, "subkriteria", id);
  await deleteDoc(ref);
};
