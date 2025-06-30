// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // If you need image uploads later

const firebaseConfig = {
  apiKey: "AIzaSyDISaVa08H1axod5trhTV_0O3lAQXCwJ-0",
  authDomain: "ankaheeverse.firebaseapp.com",
  projectId: "ankaheeverse",
  storageBucket: "ankaheeverse.firebasestorage.app",
  messagingSenderId: "222070237184",
  appId: "1:222070237184:web:574eef63e3952e0141d0e5",
  measurementId: "G-440659PR56",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
// const storage = getStorage(app); // uncomment later if needed

export { auth, db };
