// firebase/firestore/stories.js
import { db } from "../firebase/auth/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

// Create a new story
export const createStory = async (storyData) => {
  const storyRef = doc(collection(db, "stories"));
  const payload = {
    ...storyData,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(storyRef, payload);
  return { id: storyRef.id, ...payload };
};

// Get story by ID
export const getStoryById = async (storyId) => {
  const docRef = doc(db, "stories", storyId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// Get all stories (optionally by user)
export const getStories = async (userId = null) => {
  let q = collection(db, "stories");
  if (userId) {
    q = query(q, where("authorId", "==", userId));
  } else {
    // Only return approved stories for public
    q = query(q, where("status", "==", "approved"));
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Update story
export const updateStory = async (storyId, updateData) => {
  const storyRef = doc(db, "stories", storyId);
  await updateDoc(storyRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
  return true;
};

// Delete a story by ID
export const deleteStory = async (storyId) => {
  const storyRef = doc(db, "stories", storyId);
  await deleteDoc(storyRef);
  return true;
};

// Get all pending stories (for admin)
export const getPendingStories = async () => {
  const q = query(collection(db, "stories"), where("status", "==", "pending"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Set story status (approve/reject)
export const setStoryStatus = async (storyId, status) => {
  const storyRef = doc(db, "stories", storyId);
  await updateDoc(storyRef, {
    status,
    updatedAt: serverTimestamp(),
  });
  return true;
};
