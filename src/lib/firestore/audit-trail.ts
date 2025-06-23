import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";



const COLLECTION_NAME = "riwayat_pm";

// ✅ CREATE
export const createAuditTrail = async (data: IPenilaianAuditTrail) => {
  const ref = await addDoc(collection(db, COLLECTION_NAME), data);
  return ref.id; // balikin ID dokumen kalau mau
};

// ✅ READ ALL
export const getAllAuditTrail = async (): Promise<IPenilaianAuditTrail[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as IPenilaianAuditTrail[];
};

// ✅ DELETE BY ID
export const deleteAuditTrailById = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
