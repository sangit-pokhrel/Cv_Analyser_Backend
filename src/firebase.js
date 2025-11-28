// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqq2NaHo6bjez0206wPlDiZaITw4uANsc",
  authDomain: "cv-analyser-4f92d.firebaseapp.com",
  projectId: "cv-analyser-4f92d",
  storageBucket: "cv-analyser-4f92d.firebasestorage.app",
  messagingSenderId: "1037201943996",
  appId: "1:1037201943996:web:0366e856a04581a0fa4fb9",
  measurementId: "G-EFM5XE08EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;