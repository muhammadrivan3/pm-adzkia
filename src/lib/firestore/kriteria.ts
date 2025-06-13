// lib/firestore/kriteria.ts
import { db } from "../firebase"; // Pastikan sudah mengimport db dari file firebase config
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";



// Fungsi untuk menambah Kriteria
export const createKriteria = async (data: IKriteriaCreate) => {
  const ref = collection(db, "kriteria");
  const docRef = await addDoc(ref, data);
  return docRef.id;
};

// Fungsi untuk mengambil semua Kriteria
export const getAllKriteria = async (): Promise<IKriteria[]> => {
  const ref = collection(db, "kriteria");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({id:doc.id, ...doc.data()}) ) as IKriteria[];
};
// ✅ Get User by ID
export const getKriteriaById = async (id: string) => {
  const userRef = doc(db, "kriteria", id)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}
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
  // const ref = doc(db, "kriteria", id);
  // try{
  //   const refSub = doc(db, "subkriteria", id);
  //   const q = query(ref, where("kriteriaId", "==", id));
  // await deleteDoc(ref);

  // }
  // await deleteDoc(ref);
   try {
    // Hapus semua subkriteria yang terkait dengan kriteriaId
    const subRef = collection(db, "subkriteria");
    const q = query(subRef, where("kriteriaId", "==", id));
    const snapshot = await getDocs(q);

    const deleteSubPromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deleteSubPromises);

    // Hapus dokumen kriteria
    const kriteriaRef = doc(db, "kriteria", id);
    await deleteDoc(kriteriaRef);

    console.log("Kriteria dan subkriteria berhasil dihapus.");
  } catch (error) {
    console.error("Gagal menghapus kriteria:", error);
  }
};
