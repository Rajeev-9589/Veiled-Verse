// firebase/firestore/notes.js
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

// Add note (highlight or personal comment)
export const addNote = async ({ userId, storyId, content, highlight }) => {
  const noteRef = doc(collection(db, "notes"));
  const payload = {
    userId,
    storyId,
    content,
    highlight,
    createdAt: serverTimestamp(),
  };
  await setDoc(noteRef, payload);
  return { id: noteRef.id, ...payload };
};

// Get all notes for a particular story
export const getNotesByStory = async (storyId) => {
  const q = query(collection(db, "notes"), where("storyId", "==", storyId));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get all notes by a user
export const getNotesByUser = async (userId) => {
  const q = query(collection(db, "notes"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Delete a note
export const deleteNote = async (noteId) => {
  const noteRef = doc(db, "notes", noteId);
  await deleteDoc(noteRef);
  return true;
};
