// lib/firestore/user.ts
import bcrypt from "bcryptjs";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData,
  getDoc,
} from "firebase/firestore";
import { verifyPassword } from "../hashing";

// ✅ CREATE
export const createUser = async (user: {
  // id:string;
  email: string;
  password: string;
  name?: string;
  role?: string;
  status?: string;
}) => {
   // Enkripsi password dengan bcrypt
  const hashedPassword = await bcrypt.hash(user.password, 10); // 10 adalah salt rounds
  const userData = {
    email: user.email,
    password: hashedPassword, // Simpan password yang sudah di-hash
    name: user.name,
    role: user.role,
    status: user.status,
  };
  const ref = collection(db, "users");
  const docRef = await addDoc(ref, userData);
  return docRef.id;
};

// ✅ READ (all users)
export const getAllUsers = async (): Promise<IUser[]> => {
  const ref = collection(db, "users");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) ) as IUser[];
};

// ✅ READ by email & password (for login)
export const findUser = async (email: string, password: string): Promise<DocumentData | null> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
 if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    
    // Verifikasi password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (isPasswordValid) {
      return { id: userDoc.id, ...user };
    } else {
      console.error("Password salah");
      return null; // Password salah
    }
  } else {
    return null; // User tidak ditemukan
  }

};

// ✅ UPDATE
export const updateUser = async (id: string, data: Partial<{ name: string; role: string; status: string; password: string }>) => {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, data);
};

// ✅ DELETE
export const deleteUser = async (id: string) => {
  const userRef = doc(db, "users", id);
  await deleteDoc(userRef);
};

// ✅ Get User by ID
export const getUserById = async (id: string) => {
  const userRef = doc(db, "users", id)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}