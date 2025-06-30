import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  BookOpen,
  PencilLine,
  Sparkles,
  Star,
  Heart,
  Eye,
  TrendingUp,
  Crown,
  Users,
  BookMarked,
  ArrowRight,
  Play,
  Zap,
} from "lucide-react";
import { useEnhancedAuth } from "../contexts/EnhancedAuthContext";
import { useEnhancedStory } from "../contexts/EnhancedStoryContext";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../Backend/firebase/auth/auth";

const HomeComponent = () => {
  const { userData, hasPermission } = useEnhancedAuth();
  const { stories, getFilteredStories } = useEnhancedStory();
  const [featuredStories, setFeaturedStories] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalStories: 0,
    activeReaders: 0,
    averageRating: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Fetch featured stories (top-rated, most viewed)
        const storiesRef = collection(db, "stories");
        const featuredQuery = query(
          storiesRef,
          orderBy("rating", "desc"),
          limit(6),
        );
        const featuredSnapshot = await getDocs(featuredQuery);

        const featuredData = featuredSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          authorName: doc.data().authorName || "Unknown Author",
          rating: doc.data().rating || 0,
          views: doc.data().views || 0,
          likes: doc.data().likes || 0,
        }));

        // If not enough high-rated stories, get most viewed ones
        if (featuredData.length < 3) {
          const popularQuery = query(
            storiesRef,
            orderBy("views", "desc"),
            limit(6),
          );
          const popularSnapshot = await getDocs(popularQuery);
          const popularData = popularSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            authorName: doc.data().authorName || "Unknown Author",
            rating: doc.data().rating || 0,
            views: doc.data().views || 0,
            likes: doc.data().likes || 0,
          }));

          // Merge and deduplicate
          const allStories = [...featuredData, ...popularData];
          const uniqueStories = allStories.filter(
            (story, index, self) =>
              index === self.findIndex((s) => s.id === story.id),
          );
          setFeaturedStories(uniqueStories.slice(0, 6));
        } else {
          setFeaturedStories(featuredData);
        }

        // Calculate platform stats
        const allStoriesQuery = query(storiesRef);
        const allStoriesSnapshot = await getDocs(allStoriesQuery);
        const allStories = allStoriesSnapshot.docs.map((doc) => doc.data());

        const totalStories = allStories.length;
        const totalViews = allStories.reduce(
          (sum, story) => sum + (story.views || 0),
          0,
        );
        const totalRatings = allStories.reduce(
          (sum, story) => sum + (story.rating || 0),
          0,
        );
        const averageRating =
          totalStories > 0 ? (totalRatings / totalStories).toFixed(1) : 0;

        // Estimate active readers (this would come from userActivity collection in production)
        const activeReaders = Math.floor(totalViews / 10); // Rough estimate

        setPlatformStats({
          totalStories,
          activeReaders,
          averageRating: parseFloat(averageRating),
          totalViews,
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
        setFeaturedStories([]);
        setPlatformStats({
          totalStories: 0,
          activeReaders: 0,
          averageRating: 0,
          totalViews: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const stats = [
    {
      icon: BookMarked,
      value: `${platformStats.totalStories.toLocaleString()}+`,
      label: "Stories Published",
    },
    {
      icon: Users,
      value: `${platformStats.activeReaders.toLocaleString()}+`,
      label: "Active Readers",
    },
    {
      icon: Star,
      value: platformStats.averageRating.toString(),
      label: "Average Rating",
    },
    {
      icon: TrendingUp,
      value: `${platformStats.totalViews.toLocaleString()}+`,
      label: "Total Views",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-pink-200 rounded-full blur-xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-40 left-20 w-20 h-20 bg-indigo-200 rounded-full blur-xl opacity-30"
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-28 h-28 bg-purple-300 rounded-full blur-xl opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          className="relative text-center py-24 lg:py-32"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Floating glowing background element */}
          <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-[600px] h-[600px] bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-purple-200/50">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Welcome to Veiled Verse
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-transparent bg-clip-text mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="inline-block">
                <span className="flex items-baseline justify-center gap-2">
                  Veiled Verse
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-purple-500" />
                  </motion.div>
                </span>
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-700 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              A cosmos of hidden tales, waiting to be told. Read, write, and
              weave your magic into the fabric of storytelling.
              <span className="block text-sm text-gray-500 mt-2">
                - Saranghaeyo 😁
              </span>
            </motion.p>

            <motion.div
              className="mt-8 flex justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/marketplace">
                    <BookOpen size={20} /> Explore Stories
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="gap-3 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/write">
                    <PencilLine size={20} /> Start Writing
                    <Zap size={18} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Stories */}
        <motion.div
          className="mb-24"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Featured Stories
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover the most captivating tales from our talented community
                of writers
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : featuredStories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Stories Yet
              </h3>
              <p className="text-gray-500">
                Be the first to publish a story and inspire others!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-purple-600 text-white">
                          {story.genre || "Fiction"}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {story.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {story.description ||
                          "A captivating story waiting to be discovered..."}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                          by {story.authorName}
                        </span>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {story.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {story.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        <Link to={`/story/${story.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          Read Story
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-lg mb-8 text-purple-100 max-w-2xl mx-auto">
              Join thousands of writers and readers in our vibrant storytelling
              community. Your next masterpiece is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
              >
                <Link to="/write">
                  <PencilLine className="w-5 h-5 mr-2" />
                  Start Writing
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold"
              >
                <Link to="/marketplace">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore More
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeComponent;
