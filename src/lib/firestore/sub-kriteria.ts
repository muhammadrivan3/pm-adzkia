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
  doc
} from "firebase/firestore";

// Fungsi untuk menambah Subkriteria
export const createSubkriteria = async (data: ISubKriteriaCreate) => {
  const ref = collection(db, "subkriteria");
  const docRef = await addDoc(ref, data);
  return docRef.id;
};
export const getAllSubkriteria = async (): Promise<ISubKriteria[]> => {
  const snapshot = await getDocs(collection(db, "subkriteria"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ISubKriteria[];
};

// Fungsi untuk mengambil Subkriteria berdasarkan ID Subkriteria
export const getSubkriteriaByIdSubkriteria = async (id: string): Promise<ISubKriteria | null> => {
  
  const snapshot = await getDocs(query(collection(db, "subkriteria"), where("__name__", "==", id)));

  if (!snapshot.empty) {
    const docData = snapshot.docs[0];
    return { id: docData.id, ...docData.data() } as ISubKriteria;
  }

  return null;
};

// Fungsi untuk mengambil semua Subkriteria berdasarkan Kriteria ID
export const getSubkriteriaByKriteriaId = async (kriteriaId: string): Promise<ISubKriteria[]> => {
  const ref = collection(db, "subkriteria");
  const q = query(ref, where("kriteriaId", "==", kriteriaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}) as ISubKriteria);
};

// Fungsi untuk update Subkriteria
export const updateSubkriteria = async (
  id: string,
  data: Partial<ISubKriteria>
) => {
  const ref = doc(db, "subkriteria", id);
  await updateDoc(ref, data);
};

// Fungsi untuk delete Subkriteria
export const deleteSubkriteria = async (id: string) => {
  const ref = doc(db, "subkriteria", id);
  await deleteDoc(ref);
};
