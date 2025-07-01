import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStories, getStoryById, updateStory, createStory, deleteStory as deleteStoryBackend } from "../../Backend/firestore/stories";
import { getUserPurchases, purchaseStory } from "../../Backend/firestore/purchases";
import { useEnhancedAuth } from "./EnhancedAuthContext";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { toast } from "sonner";
import { addEarning } from "../../Backend/firestore/wallet";

const EnhancedStoryContext = createContext();

export const EnhancedStoryContextProvider = ({ children }) => {
  const [stories, setStories] = useState([]);
  const [purchasedStories, setPurchasedStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offlineActions, setOfflineActions] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    price: "all",
    sortBy: "latest",
    search: ""
  });

  const { userData, hasPermission } = useEnhancedAuth();
  const { isOnline } = useNetworkStatus();
  // Simple stories fetch - no real-time updates for better performance
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const storiesData = await getStories();
        setStories(storiesData);
        
        // Update user stories
        if (userData?.uid) {
          const userStoriesData = storiesData.filter(story => story.authorId === userData.uid);
          setUserStories(userStoriesData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stories:", error);
        toast.error("Failed to load stories");
        setLoading(false);
      }
    };

    fetchStories();
  }, [userData?.uid]);

  // Fetch purchased stories
  useEffect(() => {
    const fetchPurchased = async () => {
      if (!userData?.uid) return;

      try {
        const purchased = await getUserPurchases(userData.uid);
        setPurchasedStories(purchased || []);
      } catch (error) {
        console.error("Error fetching purchased stories:", error);
      }
    };

    fetchPurchased();
  }, [userData?.uid]);

  // Increment view count for a story
  const incrementViewCount = useCallback(async (storyId) => {
    try {
      // Optimistic update
      setStories(prev => prev.map(story =>
        story.id === storyId ? { ...story, views: (story.views || 0) + 1 } : story
      ));
      await updateStory(storyId, { views: (stories.find(s => s.id === storyId)?.views || 0) + 1 });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  }, [stories]);

  // Optimized story purchase with purchase count and earnings
  const buyStory = useCallback(async (storyId, price) => {
    if (!userData?.uid) {
      toast.error("Please log in to purchase stories");
      return false;
    }

    if (purchasedStories.includes(storyId)) {
      toast.info("You already own this story");
      return true;
    }

    try {
      await purchaseStory(userData.uid, storyId, price);
      setPurchasedStories(prev => [...prev, storyId]);
      // Find the story and author
      const story = stories.find(s => s.id === storyId);
      if (story) {
        // Calculate earnings (70% to author)
        const earning = Math.round((price || story.price || 0) * 0.7);
        if (story.authorId && earning > 0) {
          await addEarning(story.authorId, earning, "story_purchase");
        }
        // Update purchases and earnings count in Firestore and local state
        await updateStory(storyId, {
          purchases: (story.purchases || 0) + 1,
          earnings: (story.earnings || 0) + earning,
        });
        setStories(prev => prev.map(s =>
          s.id === storyId
            ? { ...s, purchases: (s.purchases || 0) + 1, earnings: (s.earnings || 0) + earning }
            : s
        ));
      }
      toast.success("Story purchased successfully!");
      return true;
    } catch (error) {
      console.error("Error buying story:", error);
      toast.error("Failed to purchase story");
      return false;
    }
  }, [userData?.uid, purchasedStories, stories]);

  // Optimized story creation
  const createNewStory = useCallback(async (storyData) => {
    if (!hasPermission('publish')) {
      toast.error("You don't have permission to publish stories");
      return null;
    }

    try {
      const enhancedStoryData = {
        ...storyData,
        authorId: userData.uid,
        authorName: userData.name,
        status: "published",
        views: 0,
        likes: 0,
        purchases: 0,
        comments: [],
        ratings: [],
        averageRating: 0,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const newStory = await createStory(enhancedStoryData);
      
      // Optimistic update
      setStories(prev => [newStory, ...prev]);
      setUserStories(prev => [newStory, ...prev]);
      
      toast.success("Story published successfully!");
      return newStory;
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to publish story");
      return null;
    }
  }, [userData, hasPermission]);

  // Optimized story update
  const updateStoryData = useCallback(async (storyId, updates) => {
    try {
      await updateStory(storyId, updates);
      
      // Optimistic update
      setStories(prev => prev.map(story => 
        story.id === storyId ? { ...story, ...updates } : story
      ));
      
      toast.success("Story updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Failed to update story");
      return false;
    }
  }, []);

  // Optimized story like with optimistic updates
  const likeStory = useCallback(async (storyId) => {
    if (!userData?.uid) {
      toast.error("Please log in to like stories");
      return;
    }

    try {
      const story = stories.find(s => s.id === storyId);
      if (!story) return;

      const hasLiked = story.likedBy?.includes(userData.uid);
      const newLikes = hasLiked ? (story.likes || 1) - 1 : (story.likes || 0) + 1;
      const newLikedBy = hasLiked 
        ? (story.likedBy || []).filter(id => id !== userData.uid)
        : [...(story.likedBy || []), userData.uid];

      // Optimistic update for immediate feedback
      setStories(prev => prev.map(s => 
        s.id === storyId 
          ? { ...s, likes: newLikes, likedBy: newLikedBy }
          : s
      ));

      // Update in background
      await updateStory(storyId, {
        likes: newLikes,
        likedBy: newLikedBy
      });

      toast.success(hasLiked ? "Story unliked" : "Story liked!");
    } catch (error) {
      console.error("Error liking story:", error);
      toast.error("Failed to like story");
      
      // Revert optimistic update on error
      setStories(prev => prev.map(s => 
        s.id === storyId 
          ? { ...s, likes: story.likes, likedBy: story.likedBy }
          : s
      ));
    }
  }, [userData?.uid, stories]);

  // Optimized story rating with optimistic updates
  const rateStory = useCallback(async (storyId, rating) => {
    if (!userData?.uid) {
      toast.error("Please log in to rate stories");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    try {
      const story = stories.find(s => s.id === storyId);
      if (!story) return;

      const existingRating = story.ratings?.find(r => r.userId === userData.uid);
      const newRatings = existingRating
        ? story.ratings.map(r => r.userId === userData.uid ? { ...r, rating } : r)
        : [...(story.ratings || []), { userId: userData.uid, rating, date: new Date() }];

      const averageRating = newRatings.reduce((sum, r) => sum + r.rating, 0) / newRatings.length;

      // Optimistic update
      setStories(prev => prev.map(s => 
        s.id === storyId 
          ? { ...s, ratings: newRatings, averageRating: Math.round(averageRating * 10) / 10 }
          : s
      ));

      // Update in background
      await updateStory(storyId, {
        ratings: newRatings,
        averageRating: Math.round(averageRating * 10) / 10
      });

      toast.success("Rating submitted successfully!");
    } catch (error) {
      console.error("Error rating story:", error);
      toast.error("Failed to submit rating");
    }
  }, [userData?.uid, stories]);

  // Optimized filter function
  const getFilteredStories = useCallback(() => {
    let filtered = [...stories];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchLower) ||
        story.description?.toLowerCase().includes(searchLower) ||
        story.authorName?.toLowerCase().includes(searchLower)
      );
    }

    // Apply genre filter
    if (filters.genre) {
      filtered = filtered.filter(story => story.genre === filters.genre);
    }

    // Apply price filter
    if (filters.price === "free") {
      filtered = filtered.filter(story => !story.isPaid);
    } else if (filters.price === "paid") {
      filtered = filtered.filter(story => story.isPaid);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "trending":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default: // latest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [stories, filters]);

  // Utility functions
  const isStoryOwner = useCallback((storyId) => {
    return userStories.some(story => story.id === storyId);
  }, [userStories]);

  const canReadStory = useCallback((story) => {
    if (!story.isPaid) return true;
    if (hasPermission('read_premium')) return true;
    return purchasedStories.includes(story.id);
  }, [purchasedStories, hasPermission]);

  // Offline action handling
  const addOfflineAction = useCallback((action) => {
    const offlineAction = {
      id: Date.now().toString(),
      action,
      timestamp: new Date(),
      retries: 0
    };
    setOfflineActions(prev => [...prev, offlineAction]);
    
    // Store in localStorage for persistence
    const stored = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    stored.push(offlineAction);
    localStorage.setItem('offlineActions', JSON.stringify(stored));
  }, []);

  const processOfflineActions = useCallback(async () => {
    if (!isOnline || offlineActions.length === 0) return;

    const actionsToProcess = [...offlineActions];
    setOfflineActions([]);
    localStorage.setItem('offlineActions', '[]');

    for (const offlineAction of actionsToProcess) {
      try {
        switch (offlineAction.action.type) {
          case 'CREATE_STORY':
            await createNewStory(offlineAction.action.data);
            break;
          case 'UPDATE_STORY':
            await updateStoryData(offlineAction.action.storyId, offlineAction.action.updates);
            break;
          case 'LIKE_STORY':
            await likeStory(offlineAction.action.storyId);
            break;
          case 'RATE_STORY':
            await rateStory(offlineAction.action.storyId, offlineAction.action.rating);
            break;
          default:
            console.warn('Unknown offline action type:', offlineAction.action.type);
        }
        toast.success('Offline action synced successfully!');
      } catch (error) {
        console.error('Failed to process offline action:', error);
        // Re-add failed action
        setOfflineActions(prev => [...prev, { ...offlineAction, retries: offlineAction.retries + 1 }]);
      }
    }
  }, [isOnline, offlineActions, createNewStory, updateStoryData, likeStory, rateStory]);

  // Process offline actions when coming back online
  useEffect(() => {
    if (isOnline) {
      processOfflineActions();
    }
  }, [isOnline, processOfflineActions]);

  // Load offline actions from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    setOfflineActions(stored);
  }, []);

  // Delete a story by ID
  const deleteStoryById = useCallback(async (storyId) => {
    try {
      await deleteStoryBackend(storyId);
      setStories(prev => prev.filter(story => story.id !== storyId));
      setUserStories(prev => prev.filter(story => story.id !== storyId));
      toast.success("Story deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
      return false;
    }
  }, []);

  const value = {
    // State
    stories,
    purchasedStories,
    userStories,
    loading,
    filters,
    offlineActions,
    isOnline,
    
    // Actions
    buyStory,
    createNewStory,
    updateStoryData,
    likeStory,
    rateStory,
    setFilters,
    getFilteredStories,
    addOfflineAction,
    processOfflineActions,
    incrementViewCount,
    deleteStoryById,
    
    // Utilities
    isStoryOwner,
    canReadStory,
    hasPermission
  };

  return (
    <EnhancedStoryContext.Provider value={value}>
      {children}
    </EnhancedStoryContext.Provider>
  );
};

export const useEnhancedStory = () => {
  const context = useContext(EnhancedStoryContext);
  if (!context) {
    throw new Error("useEnhancedStory must be used within EnhancedStoryContextProvider");
  }
  return context;
}; 