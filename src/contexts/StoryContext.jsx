import { createContext, useContext, useState, useEffect } from "react";
import { getStories } from "../../Backend/firestore/stories";
import { useAuth } from "./AuthContext";
import { getUserPurchases, purchaseStory } from "../../Backend/firestore/purchases"; // Modularized purchase helpers

export const StoryContext = createContext();

export const StoryContextProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [purchasedStories, setPurchasedStories] = useState([]);
  const { currentUser } = useAuth();

  // Fetch all stories on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const fetchedStories = await getStories();
        setStories(fetchedStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  // Fetch purchased stories when user logs in
  useEffect(() => {
    const fetchPurchased = async () => {
      if (!currentUser) return;

      try {
        const purchased = await getUserPurchases(currentUser.uid);
        setPurchasedStories(purchased || []);
      } catch (error) {
        console.error("Error fetching purchased stories:", error);
      }
    };

    fetchPurchased();
  }, [currentUser]);

  // Handle story purchase
  const buyStory = async (storyId) => {
    if (!currentUser || purchasedStories.includes(storyId)) return;

    try {
      await purchaseStory(currentUser.uid, storyId);
      setPurchasedStories((prev) => [...prev, storyId]);
    } catch (error) {
      console.error("Error buying story:", error);
    }
  };

  return (
    <StoryContext.Provider
      value={{
        stories,
        setStories,
        purchasedStories,
        buyStory,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};
