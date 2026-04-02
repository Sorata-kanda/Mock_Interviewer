// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgl9-6MHVe1hZN1ithy8h8gxlf1tLW1jw",
  authDomain: "prepwise-4452b.firebaseapp.com",
  projectId: "prepwise-4452b",
  storageBucket: "prepwise-4452b.firebasestorage.app",
  messagingSenderId: "606990196768",
  appId: "1:606990196768:web:7aebed0f65c35a33975c45",
  measurementId: "G-N2P7Z8Z0T6"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);