// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCidyaZraL1MDyxleqTTzXjrQnBLO7v_8M",
  authDomain: "banking-system-8d0f8.firebaseapp.com",
  projectId: "banking-system-8d0f8",
  storageBucket: "banking-system-8d0f8.firebasestorage.app",
  messagingSenderId: "447087931721",
  appId: "1:447087931721:web:57518668b8c9a6ef3dea98",
  measurementId: "G-K1B2QMZVY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};