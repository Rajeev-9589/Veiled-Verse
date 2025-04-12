import { db } from "../firebase/auth/auth";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";

// Save purchased story to the user's purchase list
export const purchaseStory = async (userId, storyId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    // Add the purchased story ID to the user's purchases
    await updateDoc(userRef, {
      purchasedStories: arrayUnion(storyId),
    });

    console.log(`Story ${storyId} purchased by user ${userId}`);
    return true;
  } catch (error) {
    console.error("Error purchasing story:", error.message);
    throw error;
  }
};

// Optional: Get purchased stories for a user
export const getUserPurchases = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().purchasedStories || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching purchased stories:", error.message);
    return [];
  }
};
