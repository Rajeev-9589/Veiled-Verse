import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase/auth/auth.js"; // Adjust path if needed

async function initializeEarningsForAllStories() {
  const storiesCol = collection(db, "stories");
  const snapshot = await getDocs(storiesCol);
  for (const storyDoc of snapshot.docs) {
    const data = storyDoc.data();
    if (typeof data.earnings === "undefined") {
      await updateDoc(doc(db, "stories", storyDoc.id), { earnings: 0 });
      console.log(`Initialized earnings for story: ${storyDoc.id}`);
    }
  }
  console.log("Earnings field initialized for all stories.");
}

initializeEarningsForAllStories();