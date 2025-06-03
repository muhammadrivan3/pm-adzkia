// lib/firestore/kriteria.ts
import { db } from "../firebase"; // Pastikan sudah mengimport db dari file firebase config
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";



// Fungsi untuk menambah Kriteria
export const createKriteria = async (data: IKriteriaCreate) => {
  const ref = collection(db, "kriteria");
  const docRef = await addDoc(ref, data);
  return docRef.id;
};

// Fungsi untuk mengambil semua Kriteria
export const getAllKriteria = async (): Promise<IKriteria[]> => {
  const ref = collection(db, "I");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => doc.data() ) as IKriteria[];
};

// Fungsi untuk update Kriteria
export const updateKriteria = async (
  id: string,
  data: Partial<IKriteria>
) => {
  const ref = doc(db, "kriteria", id);
  await updateDoc(ref, data);
};

// Fungsi untuk delete Kriteria
export const deleteKriteria = async (id: string) => {
  const ref = doc(db, "kriteria", id);
  await deleteDoc(ref);
};
