// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkMxllZoJNsMnEGkn2QNA9MNJp7NCCTok",
  authDomain: "pm-lecture-adzkia.firebaseapp.com",
  projectId: "pm-lecture-adzkia",
  storageBucket: "pm-lecture-adzkia.firebasestorage.app",
  messagingSenderId: "573397493356",
  appId: "1:573397493356:web:50be6dfc2f4170076b9a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);