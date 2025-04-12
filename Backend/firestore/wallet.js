// firebase/firestore/wallet.js
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Initialize wallet if not exists
const ensureWalletExists = async (userId) => {
  const walletRef = doc(db, "wallets", userId);
  const snap = await getDoc(walletRef);
  if (!snap.exists()) {
    await setDoc(walletRef, { balance: 0 });
  }
  return walletRef;
};

// Get wallet balance
export const getWalletBalance = async (userId) => {
  const walletRef = await ensureWalletExists(userId);
  const snap = await getDoc(walletRef);
  return snap.data().balance;
};

// Add earning to wallet
export const addEarning = async (userId, amount, source = "story_read") => {
  const walletRef = await ensureWalletExists(userId);

  // Update balance
  await updateDoc(walletRef, {
    balance: (await getWalletBalance(userId)) + amount,
  });

  // Log earning
  const earningRef = collection(db, "wallets", userId, "earnings");
  await addDoc(earningRef, {
    amount,
    source,
    createdAt: serverTimestamp(),
  });
};

// Get earnings history
export const getEarningHistory = async (userId) => {
  const earningsRef = collection(db, "wallets", userId, "earnings");
  const snap = await getDocs(earningsRef);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Request withdrawal
export const requestWithdrawal = async (userId, amount) => {
  const walletRef = doc(db, "wallets", userId);
  const snap = await getDoc(walletRef);
  const currentBalance = snap.data()?.balance || 0;

  if (amount > currentBalance) {
    throw new Error("Insufficient balance");
  }

  // Subtract balance
  await updateDoc(walletRef, {
    balance: currentBalance - amount,
  });

  // Log withdrawal request
  const withdrawRef = collection(db, "wallets", userId, "withdrawals");
  await addDoc(withdrawRef, {
    amount,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
