import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useEnhancedStory } from "../contexts/EnhancedStoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Heart,
  Eye,
  Star,
  ArrowLeft,
  Share2,
  BookOpen,
  ShoppingCart,
  Clock,
  User,
  Tag,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const StoryRead = () => {
  const { id } = useParams();
  const { stories, likeStory, rateStory, canReadStory, buyStory } =
    useEnhancedStory();
  const [story, setStory] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const foundStory = stories.find((s) => s.id === id);
    setStory(foundStory);
    if (foundStory) {
      setIsLiked(foundStory.likedBy?.includes(foundStory.authorId) || false);
    }
  }, [id, stories]);

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    likeStory(story.id);
    setIsLiked(!isLiked);
  };

  const handleRate = (rating) => {
    setUserRating(rating);
    rateStory(story.id, rating);
    setShowRating(false);
  };

  const handleBuy = async () => {
    if (story.isPaid) {
      await buyStory(story.id, story.price);
    }
  };

  const canRead = canReadStory(story);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/marketplace">
            <Button variant="ghost" className="gap-2 hover:bg-white/50">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
        </motion.div>

        {/* Story Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {story.title}
                    </h1>
                  </div>

                  <div className="flex items-center gap-3 mb-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span className="font-medium">
                        {story.authorName || "Anonymous"}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="font-medium">
                      {story.genre || "General"}
                    </Badge>
                    {story.isPaid && (
                      <Badge variant="destructive" className="font-semibold">
                        <ShoppingCart className="w-3 h-3 mr-1" />₹{story.price}
                      </Badge>
                    )}
                    {story.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{story.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span>{story.likes || 0} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <span>{story.averageRating?.toFixed(1) || 0} rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>{story.purchases || 0} purchases</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={`gap-2 ${isLiked ? "text-red-500 border-red-200 bg-red-50" : ""}`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRating(true)}
                    className="gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Rate
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>

            {story.description && (
              <CardContent className="pt-0">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-300">
                  <p className="text-gray-700 italic leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Story Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {canRead ? (
            <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0">
              <CardContent className="p-6 sm:p-8">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-purple-600 prose-strong:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: story.content }}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0">
              <CardContent className="p-8 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Premium Story
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Purchase this story to read the full content and support the
                    author.
                  </p>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Price:</span>
                      <span className="text-3xl font-bold text-purple-600">
                        ₹{story.price}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleBuy}
                    size="lg"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-lg font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy & Read Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Rating Modal */}
        <Dialog open={showRating} onOpenChange={setShowRating}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Rate this Story
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                <p className="text-sm text-gray-600">
                  How would you rate this story?
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className={`text-3xl transition-all duration-200 hover:scale-110 ${
                      star <= userRating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="text-center text-sm text-gray-500">
                {userRating > 0 && (
                  <p>
                    You rated this story {userRating} star
                    {userRating !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRating(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setShowRating(false)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Submit Rating
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StoryRead;
