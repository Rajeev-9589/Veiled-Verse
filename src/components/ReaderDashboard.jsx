import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Bookmark, Clock, Heart, Eye } from "lucide-react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { collection, query, where, getDocs, orderBy, limit, getDoc, doc } from "firebase/firestore";
import { db } from "../../Backend/firebase/firebase";

const ReaderDashboard = () => {
  const [stats, setStats] = useState({
    storiesRead: 0,
    bookmarks: 0,
    readingTime: 0,
  });
  const [recentStories, setRecentStories] = useState([]);
  const [likedStories, setLikedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useEnhancedAuth();

  useEffect(() => {
    const fetchReaderData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user's reading activity
        const activityRef = collection(db, "userActivity");
        const activityQuery = query(
          where("userId", "==", user.uid),
          where("type", "in", ["read", "bookmark", "like"])
        );
        const activitySnapshot = await getDocs(activityQuery);
        
        const activities = activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate stats
        const readActivities = activities.filter(a => a.type === "read");
        const bookmarkActivities = activities.filter(a => a.type === "bookmark");
        const likeActivities = activities.filter(a => a.type === "like");

        setStats({
          storiesRead: readActivities.length,
          bookmarks: bookmarkActivities.length,
          readingTime: readActivities.reduce((total, activity) => total + (activity.readingTime || 0), 0),
        });

        // Fetch recent stories (last 5 read)
        const recentStoryIds = readActivities.slice(0, 5).map(a => a.storyId);
        const recentStoriesData = [];
        
        for (const storyId of recentStoryIds) {
          try {
            const storyRef = doc(db, "stories", storyId);
            const storyDoc = await getDoc(storyRef);
            if (storyDoc.exists()) {
              recentStoriesData.push({
                id: storyDoc.id,
                ...storyDoc.data()
              });
            }
          } catch (error) {
            console.error("Error fetching story:", storyId, error);
          }
        }
        setRecentStories(recentStoriesData);

        // Fetch liked stories (last 5 liked)
        const likedStoryIds = likeActivities.slice(0, 5).map(a => a.storyId);
        const likedStoriesData = [];
        
        for (const storyId of likedStoryIds) {
          try {
            const storyRef = doc(db, "stories", storyId);
            const storyDoc = await getDoc(storyRef);
            if (storyDoc.exists()) {
              likedStoriesData.push({
                id: storyDoc.id,
                ...storyDoc.data()
              });
            }
          } catch (error) {
            console.error("Error fetching story:", storyId, error);
          }
        }
        setLikedStories(likedStoriesData);

      } catch (error) {
        console.error("Error fetching reader data:", error);
        setStats({
          storiesRead: 0,
          bookmarks: 0,
          readingTime: 0,
        });
        setRecentStories([]);
        setLikedStories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReaderData();
  }, [user]);

  const formatReadingTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.h3 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold mb-6 flex items-center gap-2"
      >
        <BookOpen className="w-5 h-5 text-purple-600" />
        Reader Dashboard
      </motion.h3>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm text-blue-700 font-medium">Stories Read</h4>
          </div>
          <p className="text-2xl font-bold text-blue-800">{stats.storiesRead}</p>
        </div>
  
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm text-purple-700 font-medium">Bookmarks</h4>
          </div>
          <p className="text-2xl font-bold text-purple-800">{stats.bookmarks}</p>
        </div>
  
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <h4 className="text-sm text-green-700 font-medium">Reading Time</h4>
          </div>
          <p className="text-2xl font-bold text-green-800">{formatReadingTime(stats.readingTime)}</p>
        </div>
      </motion.div>

      {/* Recent Stories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mb-6"
      >
        <h4 className="font-semibold mb-4 flex items-center gap-2 text-blue-800">
          <BookOpen className="w-4 h-4" />
          Recent Stories
        </h4>
        {recentStories.length === 0 ? (
          <p className="text-gray-500 text-sm">No stories read yet. Start exploring!</p>
        ) : (
          <div className="space-y-2">
            {recentStories.map((story) => (
              <div key={story.id} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{story.title}</p>
                  <p className="text-sm text-gray-600">by {story.authorName || "Unknown"}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {story.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Liked Stories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-4 border border-pink-200"
      >
        <h4 className="font-semibold mb-4 flex items-center gap-2 text-pink-800">
          <Heart className="w-4 h-4" />
          Liked Stories
        </h4>
        {likedStories.length === 0 ? (
          <p className="text-gray-500 text-sm">No liked stories yet. Like some stories to see them here!</p>
        ) : (
          <div className="space-y-2">
            {likedStories.map((story) => (
              <div key={story.id} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{story.title}</p>
                  <p className="text-sm text-gray-600">by {story.authorName || "Unknown"}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {story.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      </div>
    );
  };
  
  export default ReaderDashboard;
  