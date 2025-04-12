// firebase/firestore/subscriptions.js
import { db } from '../firebase/auth/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Subscription Tiers: "free", "silver", "gold"

// Create or update a subscription
export const createSubscription = async (userId, tier, startDate, endDate = null) => {
  if (!userId || !tier || !startDate) return;
  try {
    const subRef = doc(db, 'subscriptions', userId);
    await setDoc(subRef, {
      tier,
      startDate,
      endDate,
      isActive: true
    });
    return true;
  } catch (error) {
    console.error('Error creating subscription:', error);
    return false;
  }
};

// Add a subscription (used in dummy Stripe flow)
export const addSubscription = async (subscriptionData) => {
  const { userId } = subscriptionData;
  if (!userId) return;
  try {
    const subRef = doc(db, 'subscriptions', userId);
    await setDoc(subRef, subscriptionData);
    return true;
  } catch (error) {
    console.error('Error adding subscription:', error);
    return false;
  }
};

// Get a user's subscription
export const getSubscription = async (userId) => {
  if (!userId) return null;
  try {
    const subRef = doc(db, 'subscriptions', userId);
    const snap = await getDoc(subRef);
    if (snap.exists()) {
      return snap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

// Update subscription fields
export const updateSubscription = async (userId, updates) => {
  if (!userId || !updates) return;
  try {
    const subRef = doc(db, 'subscriptions', userId);
    await updateDoc(subRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return false;
  }
};

// Cancel a subscription
export const cancelSubscription = async (userId) => {
  if (!userId) return;
  try {
    const subRef = doc(db, 'subscriptions', userId);
    await updateDoc(subRef, {
      isActive: false,
      endDate: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
};
