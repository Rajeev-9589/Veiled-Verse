// WriterDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../Backend/firebase/firebase";
import { motion } from "framer-motion";
import { BookOpen, Heart, MessageSquare, TrendingUp, Calendar, Eye } from "lucide-react";

const WriterDashboard = () => {
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({
    totalStories: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0,
  });
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWriterData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        setLoading(true);

        // Fetch user's stories
        const storiesQuery = query(
          collection(db, "stories"),
          where("authorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const storiesSnapshot = await getDocs(storiesQuery);
        const storiesData = storiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(storiesData);

        // Calculate stats from stories
        const totalLikes = storiesData.reduce((sum, story) => sum + (story.likes || 0), 0);
        const totalComments = storiesData.reduce((sum, story) => sum + (story.comments || 0), 0);
        const totalViews = storiesData.reduce((sum, story) => sum + (story.views || 0), 0);

        setStats({
          totalStories: storiesData.length,
          totalLikes,
          totalComments,
          totalViews,
        });

        // Generate earnings data for the last 6 months
        const earningsData = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          
          // Calculate earnings for this month (this would come from actual purchase data)
          const monthStories = storiesData.filter(story => {
            const storyDate = story.createdAt?.toDate?.() || new Date();
            return storyDate.getMonth() === date.getMonth() && 
                   storyDate.getFullYear() === date.getFullYear();
          });
          
          const monthEarnings = monthStories.reduce((sum, story) => {
            if (story.isPaid) {
              // This would be calculated from actual purchases
              return sum + (story.price || 0) * (story.purchases || 0);
            }
            return sum;
          }, 0);

          earningsData.push({
            name: monthName,
            earnings: monthEarnings,
          });
        }

        setEarningsData(earningsData);

      } catch (error) {
        console.error("Error fetching writer data:", error);
        setStories([]);
        setStats({
          totalStories: 0,
          totalLikes: 0,
          totalComments: 0,
          totalViews: 0,
        });
        setEarningsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWriterData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600" />
          Writer Dashboard
        </h1>
      </motion.div>

      {/* Insights Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <Card className="shadow-sm border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <div className="text-sm text-blue-700 font-medium">Total Stories</div>
            </div>
            <div className="text-xl font-bold text-blue-800">{stats.totalStories}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-600" />
              <div className="text-sm text-red-700 font-medium">Total Likes</div>
            </div>
            <div className="text-xl font-bold text-red-800">{stats.totalLikes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <div className="text-sm text-green-700 font-medium">Total Comments</div>
            </div>
            <div className="text-xl font-bold text-green-800">{stats.totalComments.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <div className="text-sm text-purple-700 font-medium">Total Views</div>
            </div>
            <div className="text-xl font-bold text-purple-800">{stats.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
      <Card className="shadow-sm border">
        <CardContent className="p-4">
            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Earnings Overview (Last 6 Months)
            </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderColor: "#e5e7eb", borderRadius: 8 }}
                  cursor={{ fill: "rgba(147, 51, 234, 0.1)" }}
                    formatter={(value) => [`₹${value}`, "Earnings"]}
                />
                <Bar dataKey="earnings" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Story List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Your Stories
        </h2>
        {stories.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">You haven't published any stories yet.</p>
            <p className="text-sm text-gray-400 mt-2">Start writing to see your stories here!</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
              <Card key={story.id} className="shadow-sm border hover:shadow-md transition-all duration-300">
                <CardContent className="p-4 space-y-3">
                <div className="text-lg font-semibold text-purple-700 truncate">{story.title}</div>
                <div className="text-sm text-gray-600">{story.genre}</div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{story.isPaid ? `₹${story.price}` : "Free"}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {story.createdAt?.toDate?.()?.toLocaleDateString() || "Recently"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {story.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {story.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {story.comments || 0}
                    </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </motion.div>
    </div>
  );
};

export default WriterDashboard;