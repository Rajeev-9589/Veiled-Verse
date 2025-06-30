import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReaderDashboard from "@/components/ReaderDashboard";
import WriterDashboard from "@/components/WriterDashboard";
import WalletSection from "@/components/WalletSection";
import { useEnhancedAuth } from "../contexts/EnhancedAuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { motion } from "framer-motion";
import { User, BookOpen, PenTool, Crown, Wallet, Settings, TrendingUp } from "lucide-react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../Backend/firebase/firebase";

const Dashboard = () => {
  const { userData, loading: authLoading, user } = useEnhancedAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const [view, setView] = useState("reader");
  const [quickStats, setQuickStats] = useState({
    storiesRead: 0,
    storiesWritten: 0,
    totalLikes: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const tier = subscription?.tier;

  useEffect(() => {
    if (userData?.roles?.includes("writer")) {
      setView("writer");
    } else {
      setView("reader");
    }
  }, [userData]);

  useEffect(() => {
    const fetchQuickStats = async () => {
      if (!user) {
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);

        // Fetch user activity for reading stats
        const activityRef = collection(db, "userActivity");
        const activityQuery = query(
          where("userId", "==", user.uid),
          where("type", "in", ["read", "like"])
        );
        const activitySnapshot = await getDocs(activityQuery);
        const activities = activitySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const readActivities = activities.filter(a => a.type === "read");
        const likeActivities = activities.filter(a => a.type === "like");

        // Fetch user's written stories
        const storiesRef = collection(db, "stories");
        const storiesQuery = query(
          where("authorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const storiesSnapshot = await getDocs(storiesQuery);
        const userStories = storiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate total likes from user's stories
        const totalLikes = userStories.reduce((sum, story) => sum + (story.likes || 0), 0);

        setQuickStats({
          storiesRead: readActivities.length,
          storiesWritten: userStories.length,
          totalLikes: totalLikes + likeActivities.length, // likes given + likes received
        });

      } catch (error) {
        console.error("Error fetching quick stats:", error);
        setQuickStats({
          storiesRead: 0,
          storiesWritten: 0,
          totalLikes: 0,
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchQuickStats();
  }, [user]);

  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-20 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-20 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const { name, roles, uid } = userData;
  const hasReader = roles.includes("reader");
  const hasWriter = roles.includes("writer");

  const toggleView = () => {
    setView((prev) => (prev === "writer" ? "reader" : "writer"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-20">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-32 left-20 w-28 h-28 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -6, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-28 w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -18, 0],
            x: [0, 12, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-28 left-1/4 w-20 h-20 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 22, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-24 right-1/3 w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shadow-lg">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-white" />
                )}
              </div>
              
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-transparent bg-clip-text">
                  Welcome back, {name}! 👋
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Manage your stories, track your progress, and explore new content.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasReader && (
                <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <BookOpen className="w-4 h-4" />
                  Reader
                </div>
              )}
              {hasWriter && (
                <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <PenTool className="w-4 h-4" />
                  Writer
        </div>
      )}
            </div>
          </div>
        </motion.div>

        {/* Role Toggle */}
        {hasReader && hasWriter && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-xl border border-white/20 max-w-md">
              <div className="flex gap-2">
                <Button
                  variant={view === "reader" ? "default" : "ghost"}
                  onClick={() => setView("reader")}
                  className={`flex-1 transition-all duration-300 ${
                    view === "reader" 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                      : "hover:bg-white/50"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Reader
                </Button>
                <Button
                  variant={view === "writer" ? "default" : "ghost"}
                  onClick={() => setView("writer")}
                  className={`flex-1 transition-all duration-300 ${
                    view === "writer" 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" 
                      : "hover:bg-white/50"
                  }`}
                >
                  <PenTool className="w-4 h-4 mr-2" />
                  Writer
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:col-span-3"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {view === "reader" ? (
                <ReaderDashboard />
              ) : (
                <WriterDashboard />
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Wallet Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <WalletSection />
            </div>
            
            {/* Subscription Info */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Subscription</h3>
                  <p className="text-sm text-gray-500">Your current plan</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <span className="text-sm font-medium text-gray-700">Current Plan</span>
                  <span className="text-sm font-semibold text-purple-600 capitalize">{tier || "Free"}</span>
                </div>
                
                {tier && tier !== "free" && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-sm font-medium text-gray-700">Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-green-600">Active</span>
                    </div>
        </div>
      )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-white/50 border-gray-200 hover:bg-white/80 transition-all duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
                  <p className="text-sm text-gray-500">Your activity</p>
                </div>
              </div>
              
              {statsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-12 bg-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-sm font-medium text-gray-700">Stories Read</span>
                    <span className="text-sm font-semibold text-blue-600">{quickStats.storiesRead}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                    <span className="text-sm font-medium text-gray-700">Stories Written</span>
                    <span className="text-sm font-semibold text-purple-600">{quickStats.storiesWritten}</span>
      </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-sm font-medium text-gray-700">Total Likes</span>
                    <span className="text-sm font-semibold text-green-600">{quickStats.totalLikes}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
