import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnhancedStory } from "@/contexts/EnhancedStoryContext";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
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
import { handleShare } from '@/lib/utils';
import { toast } from 'sonner';

// Subcomponent: StoryStats
const StoryStats = React.memo(({ story }) => (
  <div
    className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-500"
    aria-label="Story statistics"
  >
    <div className="flex items-center gap-2">
      <Eye className="w-4 h-4" aria-hidden="true" />
      <span>{story.views || 0} views</span>
    </div>
    <div className="flex items-center gap-2">
      <Heart className="w-4 h-4" aria-hidden="true" />
      <span>{story.likes || 0} likes</span>
    </div>
    <div className="flex items-center gap-2">
      <Star className="w-4 h-4" aria-hidden="true" />
      <span>{story.averageRating?.toFixed(1) || 0} rating</span>
    </div>
    <div className="flex items-center gap-2">
      <TrendingUp className="w-4 h-4" aria-hidden="true" />
      <span>{story.purchases || 0} purchases</span>
    </div>
  </div>
));

// Subcomponent: RatingModal
const RatingModal = ({ open, onClose, onRate, userRating, storyTitle }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent
      className="max-w-md"
      aria-modal="true"
      aria-labelledby="rate-story-title"
    >
      <DialogHeader>
        <DialogTitle id="rate-story-title" className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" aria-hidden="true" />
          Rate this Story
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{storyTitle}</h3>
          <p className="text-sm text-gray-600">
            How would you rate this story?
          </p>
        </div>
        <div
          className="flex justify-center gap-2"
          role="radiogroup"
          aria-label="Rate story"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onRate(star)}
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              className={`text-3xl transition-all duration-200 hover:scale-110 ${star <= userRating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400`}
              role="radio"
              aria-checked={userRating === star}
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
            onClick={onClose}
            className="flex-1"
            aria-label="Cancel rating"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            aria-label="Submit rating"
          >
            Submit Rating
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const Preview = () => {
  const { id } = useParams();
  const { stories, likeStory, rateStory, canReadStory, buyStory, purchasedStories } =
    useEnhancedStory();
  const { userData } = useEnhancedAuth();
  const [story, setStory] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  useEffect(() => {
    const foundStory = stories.find((s) => s.id === id);
    setStory(foundStory);
    if (foundStory) {
      setIsLiked(foundStory.likedBy?.includes(foundStory.authorId) || false);
    }
  }, [id, stories]);

  const hasAccess = story && canReadStory(story);
  const isPurchased = story && purchasedStories && purchasedStories.includes(story.id);

  const handleLike = useCallback(async () => {
    setLikeLoading(true);
    await likeStory(story.id);
    setIsLiked((prev) => !prev);
    setLikeLoading(false);
  }, [likeStory, story]);

  const handleRate = useCallback(
    (rating) => {
      setUserRating(rating);
      rateStory(story.id, rating);
      setShowRating(false);
    },
    [rateStory, story],
  );

  const handleBuy = async () => {
    if (!userData) return;
    setBuyLoading(true);
    await buyStory(story.id, story.price);
    setBuyLoading(false);
  };

  const onShare = async () => {
    const url = `${window.location.origin}/preview/${story.id}`;
    const result = await handleShare({
      title: story.title,
      text: story.description,
      url,
    });
    if (result.success) {
      if (result.method === 'clipboard') {
        toast.success('Link copied to clipboard!');
      }
    } else {
      toast.error('Unable to share this story.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
            role="status"
            aria-label="Loading story"
          ></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

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
            <Button
              variant="ghost"
              className="gap-2 hover:bg-white/50"
              aria-label="Back to Marketplace"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
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
                    <Sparkles
                      className="w-5 h-5 text-purple-600"
                      aria-hidden="true"
                    />
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      {story.title}
                    </h1>
                  </div>
                  <div className="flex items-center gap-3 mb-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" aria-hidden="true" />
                      <span className="font-medium">
                        {story.authorName || "Anonymous"}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="font-medium">
                      {story.genre || "General"}
                    </Badge>
                    {story.isPaid && (
                      <Badge variant="destructive" className="font-semibold">
                        <ShoppingCart
                          className="w-3 h-3 mr-1"
                          aria-hidden="true"
                        />
                        ₹{story.price}
                      </Badge>
                    )}
                    {story.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" aria-hidden="true" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <StoryStats story={story} />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={`gap-2 ${isLiked ? "text-red-500 border-red-200 bg-red-50" : ""}`}
                    aria-label={isLiked ? "Unlike story" : "Like story"}
                    disabled={likeLoading}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                      aria-hidden="true"
                    />
                    {isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRating(true)}
                    className="gap-2"
                    aria-label="Rate story"
                  >
                    <Star className="w-4 h-4" aria-hidden="true" />
                    Rate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    aria-label="Share story"
                    onClick={onShare}
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
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
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              {story.isPaid && !isPurchased ? (
                <Button
                  onClick={handleBuy}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-lg font-semibold"
                  disabled={buyLoading}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {buyLoading ? "Processing..." : "Proceed to Buy"}
                </Button>
              ) : (
                <Link to={`/read/${story.id}`} className="w-full">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-lg font-semibold w-full"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Full Story
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* Rating Modal */}
        <RatingModal
          open={showRating}
          onClose={() => setShowRating(false)}
          onRate={handleRate}
          userRating={userRating}
          storyTitle={story.title}
        />
      </div>
    </div>
  );
};

export default Preview;
