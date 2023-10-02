// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: "es-em-destaque.firebaseapp.com",
  projectId: "es-em-destaque",
  storageBucket: "es-em-destaque.appspot.com",
  messagingSenderId: process.env.FIRESTORE_MESSAGING_SENDER_ID,
  appId: process.env.FIRESTORE_APP_ID,
  measurementId: "G-61GZVEJ8QN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)
