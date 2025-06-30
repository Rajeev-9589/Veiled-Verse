import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useEnhancedStory } from "@/contexts/EnhancedStoryContext";
import {
  Search,
  Filter,
  Heart,
  Eye,
  Star,
  BookOpen,
  TrendingUp,
  Sparkles,
  Grid3X3,
  List,
} from "lucide-react";

const Explore = () => {
  const { stories, likeStory, rateStory } = useEnhancedStory();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const genres = [
    { value: "all", label: "All Genres" },
    { value: "fiction", label: "Fiction" },
    { value: "non-fiction", label: "Non-Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "romance", label: "Romance" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "fantasy", label: "Fantasy" },
    { value: "horror", label: "Horror" },
    { value: "thriller", label: "Thriller" },
    { value: "biography", label: "Biography" },
    { value: "poetry", label: "Poetry" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "popular", label: "Most Popular" },
    { value: "likes", label: "Most Liked" },
    { value: "rating", label: "Highest Rated" },
  ];

  const filteredStories = stories
    .filter((story) => {
      const matchesSearch =
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.authorName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre =
        selectedGenre === "all" || story.genre?.toLowerCase() === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":
          return (b.views || 0) - (a.views || 0);
        case "likes":
          return (b.likes || 0) - (a.likes || 0);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

  const handleLike = (storyId) => {
    likeStory(storyId);
  };

  const handleRate = (storyId, rating) => {
    rateStory(storyId, rating);
  };

  const StoryCard = ({ story, index }) => (
    <motion.div
      key={story.id}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="group"
    >
      <Card className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 h-full border-0 overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="capitalize font-medium">
              {story.genre || "General"}
            </Badge>
            {story.isPaid && (
              <Badge variant="destructive" className="font-semibold">
                ₹{story.price}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 h-full flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {story.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3 leading-relaxed">
            {story.description ||
              "A captivating story waiting to be discovered..."}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {story.tags?.slice(0, 3).map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="font-medium">
              By {story.authorName || "Anonymous"}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold">
                {story.averageRating?.toFixed(1) || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{story.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{story.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{story.purchases || 0}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-10 font-medium"
              asChild
            >
              <Link to={`/read/${story.id}`}>
                <BookOpen className="w-4 h-4 mr-2" />
                Read
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(story.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StoryListItem = ({ story, index }) => (
    <motion.div
      key={story.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
      className="group"
    >
      <Card className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 border-0">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">
                    {story.genre || "General"}
                  </Badge>
                  {story.isPaid && (
                    <Badge variant="destructive" className="font-semibold">
                      ₹{story.price}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">
                    {story.averageRating?.toFixed(1) || 0}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {story.title}
              </h3>

              <p className="text-gray-600 mb-3 line-clamp-2">
                {story.description ||
                  "A captivating story waiting to be discovered..."}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {story.tags?.slice(0, 3).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="font-medium">
                  By {story.authorName || "Anonymous"}
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{story.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{story.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{story.purchases || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="font-medium"
                asChild
              >
                <Link to={`/read/${story.id}`}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(story.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-transparent bg-clip-text">
              Explore Stories
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600 ml-3" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover amazing stories from talented writers around the world
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-md shadow-lg border-0">
            <CardContent className="p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search stories, authors, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Genre Filter */}
                <div className="flex-1">
                  <Select
                    value={selectedGenre}
                    onValueChange={setSelectedGenre}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl">
                      <SelectValue placeholder="Select Genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.value} value={genre.value}>
                          {genre.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div className="flex-1">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500 rounded-xl">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-12 px-4"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-12 px-4"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600 font-medium">
            Found {filteredStories.length} story
            {filteredStories.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Stories Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredStories.map((story, index) => (
                <StoryCard key={story.id} story={story} index={index} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredStories.map((story, index) => (
                <StoryListItem key={story.id} story={story} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredStories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No stories found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or filters to discover amazing
                stories.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("all");
                  setSortBy("newest");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Explore;
