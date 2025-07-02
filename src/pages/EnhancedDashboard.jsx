import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Eye,
  Heart,
  Star,
  Calendar,
  Clock,
  Target,
  Award,
  Settings,
  Plus,
  Edit,
  Trash2,
  Share2,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { useEnhancedStory } from "@/contexts/EnhancedStoryContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../Backend/firebase/auth/auth";

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const { userData, hasPermission, updateUserData } = useEnhancedAuth();
  const {
    userStories,
    stories,
    purchasedStories,
    getFilteredStories,
    setFilters,
    filters,
    deleteStoryById,
  } = useEnhancedStory();

  // Get featured and trending stories from all stories
  const featuredStories = stories.filter((story) => story.featured).slice(0, 6);
  const trendingStories = stories
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate dashboard statistics
  const stats = {
    totalStories: userStories.length,
    publishedStories: userStories.filter((s) => s.publishStatus === "published")
      .length,
    totalViews: userStories.reduce((sum, s) => sum + (s.views || 0), 0),
    totalLikes: userStories.reduce((sum, s) => sum + (s.likes || 0), 0),
    totalEarnings: userStories.reduce((sum, s) => sum + (s.earnings || 0), 0),
    totalPurchases: userStories.reduce((sum, s) => sum + (s.purchases || 0), 0),
    averageRating:
      userStories.length > 0
        ? userStories.reduce((sum, s) => sum + (s.averageRating || 0), 0) /
          userStories.length
        : 0,
    purchasedStories: purchasedStories.length,
  };

  // Chart data for analytics
  const viewsData = userStories
    .map((story) => ({
      name: story.title.substring(0, 15) + "...",
      views: story.views || 0,
      likes: story.likes || 0,
      earnings: story.earnings || 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const earningsData = userStories
    .filter((story) => story.earnings > 0)
    .map((story) => ({
      name: story.title.substring(0, 15) + "...",
      earnings: story.earnings,
    }))
    .sort((a, b) => b.earnings - a.earnings)
    .slice(0, 5);

  const genreData = userStories.reduce((acc, story) => {
    const genre = story.genre || "Unknown";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(genreData).map(([genre, count]) => ({
    name: genre,
    value: count,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Handle story actions
  const handleEditStory = (storyId) => {
    navigate(`/write/${storyId}`);
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      await deleteStoryById(storyId);
    }
  };

  const handleShareStory = (storyId) => {
    const url = `${window.location.origin}/read/${storyId}`;
    navigator.clipboard.writeText(url);
    toast.success("Story link copied to clipboard!");
  };

  // Filter stories based on search
  const filteredStories = userStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const [wallet, setWallet] = useState({
    totalEarnings: 0,
    paidReadEarnings: 0,
    freeReadEarnings: 0,
    bonusEarnings: 0,
  });
  const [showSplit, setShowSplit] = useState(false);
  const splitBtnRef = useRef();
  const splitDropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        splitDropdownRef.current &&
        !splitDropdownRef.current.contains(e.target) &&
        splitBtnRef.current &&
        !splitBtnRef.current.contains(e.target)
      ) {
        setShowSplit(false);
      }
    }
    if (showSplit) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSplit]);

  useEffect(() => {
    async function fetchWallet() {
      if (!userData?.uid) return;
      const walletRef = doc(db, "wallets", userData.uid);
      const walletSnap = await getDoc(walletRef);
      if (walletSnap.exists()) {
        setWallet({
          totalEarnings: walletSnap.data().totalEarnings || 0,
          paidReadEarnings: walletSnap.data().paidReadEarnings || 0,
          freeReadEarnings: walletSnap.data().freeReadEarnings || 0,
          bonusEarnings: walletSnap.data().bonusEarnings || 0,
        });
      }
    }
    fetchWallet();
  }, [userData?.uid]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 pt-20">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                Welcome back, {userData.displayName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your stories today
              </p>
            </div>
            <Button
              onClick={() => navigate("/write")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Story
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Stories
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalStories}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Likes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalLikes.toLocaleString()}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md shadow-lg relative overflow-visible z-[60]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                    Total Earnings
                    <button
                      ref={splitBtnRef}
                      className={`ml-1 p-1 rounded-full border border-green-200 bg-white/70 shadow-sm hover:bg-green-50 focus:ring-2 focus:ring-green-300 transition flex items-center ${showSplit ? 'ring-2 ring-green-400' : ''}`}
                      onClick={() => setShowSplit((v) => !v)}
                      aria-label="Show earning split"
                      tabIndex={0}
                    >
                      <Info className="w-4 h-4 text-green-600" />
                      <motion.span
                        animate={{ rotate: showSplit ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-1"
                      >
                        <ChevronDown className="w-4 h-4 text-green-600" />
                      </motion.span>
                    </button>
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    ₹{wallet.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
              <AnimatePresence>
                {showSplit && (
                  <motion.div
                    ref={splitDropdownRef}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="absolute left-1/2 top-full z-[999] w-80 max-w-[95vw] -translate-x-1/2 mt-3"
                  >
                    {/* Pointer arrow */}
                    <div className="flex justify-center">
                      <div className="w-6 h-6 bg-white/60 backdrop-blur border border-green-200 rounded rotate-45 -mb-3 shadow-md"></div>
                    </div>
                    {/* Glassy dropdown */}
                    <div className="backdrop-blur-xl bg-white/70 border border-green-200 rounded-2xl shadow-2xl p-6 pt-4 relative overflow-hidden">
                      {/* Gradient accent bar */}
                      <div className="absolute left-0 top-0 w-full h-1.5 bg-gradient-to-r from-green-400 via-emerald-400 to-purple-400 rounded-t-2xl" />
                      <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" /> Earnings Breakdown
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-base font-semibold">
                            <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-purple-600" />
                            </span>
                            Paid Reads
                          </span>
                          <span className="font-extrabold text-purple-700 text-xl">₹{wallet.paidReadEarnings.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-gray-200" />
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-base font-semibold">
                            <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 text-2xl">📘</span>
                            </span>
                            Free Reads
                          </span>
                          <span className="font-extrabold text-blue-700 text-xl">₹{wallet.freeReadEarnings.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-gray-200" />
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-base font-semibold">
                            <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-orange-600" />
                            </span>
                            Bonuses
                          </span>
                          <span className="font-extrabold text-orange-700 text-xl">₹{wallet.bonusEarnings.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stories">My Stories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Chart */}
              <Card className="bg-white/80 backdrop-blur-md shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Story Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={viewsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Genre Distribution */}
              <Card className="bg-white/80 backdrop-blur-md shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Genre Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => navigate("/write")}
                  >
                    <Plus className="h-6 w-6" />
                    <span>New Story</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="h-6 w-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => setActiveTab("discover")}
                  >
                    <Search className="h-6 w-6" />
                    <span>Discover Stories</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => navigate("/marketplace")}
                  >
                    <DollarSign className="h-6 w-6" />
                    <span>Marketplace</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stories Tab */}
          <TabsContent value="stories" className="space-y-6">
            {/* Search and Filter */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search your stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge
                          variant={
                            story.publishStatus === "published"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {story.publishStatus}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStory(story.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleShareStory(story.id)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteStory(story.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {story.description}
                      </p>

                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline">{story.genre}</Badge>
                        {story.isPaid && (
                          <Badge variant="destructive">₹{story.price}</Badge>
                        )}
                      </div>

                      <div className="flex justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{story.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{story.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{story.averageRating?.toFixed(1) || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <Card className="bg-white/80 backdrop-blur-md shadow-lg">
                <CardHeader>
                  <CardTitle>Earnings Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#8884d8"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-white/80 backdrop-blur-md shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Rating</span>
                    <Badge variant="outline">
                      {stats.averageRating.toFixed(1)} ⭐
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Purchases</span>
                    <Badge variant="outline">{stats.totalPurchases}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Published Stories</span>
                    <Badge variant="outline">{stats.publishedStories}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stories Purchased</span>
                    <Badge variant="outline">{stats.purchasedStories}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Featured Stories */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Featured Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredStories.map((story) => (
                    <div
                      key={story.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <h4 className="font-semibold mb-2">{story.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {story.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">{story.genre}</Badge>
                        {story.isPaid && (
                          <Badge variant="destructive">₹{story.price}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Stories */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trendingStories.map((story) => (
                    <div
                      key={story.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <h4 className="font-semibold mb-2">{story.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {story.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline">{story.genre}</Badge>
                        <span className="text-sm text-gray-500">
                          {story.views} views
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
