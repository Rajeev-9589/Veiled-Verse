import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Eye, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const StoryCard = memo(
  ({
    story,
    index = 0,
    showAuthor = true,
    showStats = true,
    className = "",
    onLike,
    onBookmark,
    isLiked = false,
    isBookmarked = false,
  }) => {
    const {
      id,
      title,
      description,
      genre,
      authorName,
      rating = 0,
      views = 0,
      likes = 0,
      isPaid = false,
      price = 0,
      coverImage,
      createdAt,
    } = story;

    const handleLike = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onLike?.(id);
    };

    const handleBookmark = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onBookmark?.(id);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className={className}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden group">
          <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden">
            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            <div className="absolute top-4 left-4">
              <Badge className="bg-purple-600 text-white">
                {genre || "Fiction"}
              </Badge>
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-1 text-white">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            </div>

            {isPaid && (
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-green-600 text-white">
                  ₹{price}
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {title}
            </h3>

            <p className="text-gray-600 mb-3 line-clamp-2">
              {description || "A captivating story waiting to be discovered..."}
            </p>

            <div className="flex items-center justify-between mb-4">
              {showAuthor && (
                <span className="text-sm text-gray-500">
                  by {authorName || "Unknown"}
                </span>
              )}

              {showStats && (
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {likes.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Link to={`/read/${id}`}>
                  <Play className="w-4 h-4 mr-2" />
                  Read Story
                </Link>
              </Button>

              {onLike && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLike}
                  className={isLiked ? "text-red-600 border-red-600" : ""}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                  />
                </Button>
              )}

              {onBookmark && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleBookmark}
                  className={
                    isBookmarked ? "text-blue-600 border-blue-600" : ""
                  }
                >
                  <svg
                    className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  },
);

StoryCard.displayName = "StoryCard";

export default StoryCard;
