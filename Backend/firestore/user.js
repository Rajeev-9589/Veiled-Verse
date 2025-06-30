import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/auth/auth"; // since auth.js exports db

// Get user by UID
export const getUserById = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Update user data (name, roles, etc.)
export const updateUser = async (uid, updates) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updates);
};

// (Optional) Create user manually
export const createUser = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data);
};
// Fetch user data (roles, name, etc.) from Firestore
export const getUserDataFromFirestore = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.warn("User not found in Firestore.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
