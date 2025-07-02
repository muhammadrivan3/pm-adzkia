// lib/firestore/dosen.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// ✅ CREATE - Menambahkan data dosen
export const createDosen = async (dosen: {
  name: string;
  email: string;
  status: string;
  phone?: string;
  jabatan: IJabatanPeriode[];
}) => {
  const dosenData = {
    nama: dosen.name,
    email: dosen.email,
    status: dosen.status,
    phone: dosen.phone || null,
    jabatan: dosen.jabatan,
    createdAt: Timestamp.now(), // Menambahkan timestamp saat data dibuat
  };

  const dosenRef = collection(db, "dosen");
  const docRef = await addDoc(dosenRef, dosenData);
  return docRef.id; // Mengembalikan ID dokumen baru
};

export const getAllDosen = async (): Promise<IDosen[]> => {
  const snapshot = await getDocs(collection(db, "dosen"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IDosen[];
};
// ✅ READ (all users)
// export const getDosen = async (): Promise<DocumentData[]> => {
//   const ref = collection(db, "dosen");
//   const snapshot = await getDocs(ref);
//   return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };
// ✅ READ by ID - Mengambil data dosen berdasarkan ID
export const getDosenById = async (id: string) => {
  const dosenRef = doc(db, "dosen", id);
  const docSnap = await getDoc(dosenRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null; // Dosen tidak ditemukan
  }
};

// ✅ UPDATE - Memperbarui data dosen
export const updateDosen = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    status: string;
    phone?: string;
    jabatan: IJabatanPeriode[];
  }>
) => {
  const dosenRef = doc(db, "dosen", id);
  await updateDoc(dosenRef, data);
};

// ✅ DELETE - Menghapus data dosen
export const deleteDosen = async (id: string) => {
  // const dosenRef = doc(db, "dosen", id);
  // await deleteDoc(dosenRef);
  try {
    // Hapus semua subkriteria yang terkait dengan kriteriaId
    const subRef = collection(db, "penilaian");
    const q = query(subRef, where("dosenId", "==", id));
    const snapshot = await getDocs(q);

    const deletePenilaianPromises = snapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePenilaianPromises);

    // Hapus dokumen kriteria
    const dosenRef = doc(db, "dosen", id);
    await deleteDoc(dosenRef);
  } catch (error) {
    console.error("Gagal menghapus kriteria:", error);
  }
};
