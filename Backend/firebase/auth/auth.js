import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // ✅ added
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDISaVa08H1axod5trhTV_0O3lAQXCwJ-0",
  authDomain: "ankaheeverse.firebaseapp.com",
  projectId: "ankaheeverse",
  storageBucket: "ankaheeverse.firebasestorage.app",
  messagingSenderId: "222070237184",
  appId: "1:222070237184:web:574eef63e3952e0141d0e5",
  measurementId: "G-440659PR56",
};

// Init Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Save new user to Firestore if not already saved
const saveUserToFirestore = async (user, extra = {}) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: user.displayName || extra.name,
      email: user.email,
      roles: extra.roles || ["reader"],
      createdAt: serverTimestamp(),
    });
  }
};

// Google Login
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  await saveUserToFirestore(user);
  return user;
};

// Email/Password Signup
export const signUpWithEmail = async (
  email,
  password,
  name,
  roles = ["reader"],
) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  await saveUserToFirestore(user, { name, roles });
  return user;
};

// Email/Password Login
export const loginWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Password Reset
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// ✅ Logout
export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Clean up the listener
        resolve(user);
      },
      reject,
    );
  });
};
// ✅ Export for Navbar auth state tracking
export { auth, db, onAuthStateChanged };
