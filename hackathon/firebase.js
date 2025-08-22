// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnXHj17Xf1F7Uk8tNyD5gjyCJl04M79SA",
  authDomain: "codefury2-e3d7e.firebaseapp.com",
  projectId: "codefury2-e3d7e",
  storageBucket: "codefury2-e3d7e.firebasestorage.app",
  messagingSenderId: "134061999942",
  appId: "1:134061999942:web:04f3bf77c400b580ac0747",
  measurementId: "G-X2G1XMW3T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);
