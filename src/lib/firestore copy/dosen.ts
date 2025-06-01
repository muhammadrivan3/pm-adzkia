// lib/firestore/dosen.ts
import { db } from "../firebase";
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, deleteDoc, DocumentData, getDocs } from "firebase/firestore";

// ✅ CREATE - Menambahkan data dosen
export const createDosen = async (dosen: {
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  subjects: string[];
  phone?: string;
}) => {
  const dosenData = {
    name: dosen.name,
    email: dosen.email,
    role: dosen.role,
    status: dosen.status,
    department: dosen.department,
    subjects: dosen.subjects,
    phone: dosen.phone || null,
    createdAt: Timestamp.now(), // Menambahkan timestamp saat data dibuat
  };

  const dosenRef = collection(db, "dosen");
  const docRef = await addDoc(dosenRef, dosenData);
  return docRef.id; // Mengembalikan ID dokumen baru
};

export interface Dosen {
  id: string;
  name: string;
}
export const getAllDosen = async (): Promise<Dosen[]> => {
  const snapshot = await getDocs(collection(db, "dosen"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Dosen[];
};
// ✅ READ (all users)
export const getDosen = async (): Promise<DocumentData[]> => {
  const ref = collection(db, "dosen");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
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
export const updateDosen = async (id: string, data: Partial<{ name: string; email: string; role: string; status: string; department: string; subjects: string[]; phone: string;  }>) => {
  const dosenRef = doc(db, "dosen", id);
  await updateDoc(dosenRef, data);
};

// ✅ DELETE - Menghapus data dosen
export const deleteDosen = async (id: string) => {
  const dosenRef = doc(db, "dosen", id);
  await deleteDoc(dosenRef);
};