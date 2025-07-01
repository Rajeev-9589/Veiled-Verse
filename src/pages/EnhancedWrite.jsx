import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Heart,
} from "lucide-react";
import EnhancedStoryEditor from "@/components/EnhancedStoryEditor";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { useEnhancedStory } from "@/contexts/EnhancedStoryContext";
import { toast } from "sonner";

const EnhancedWrite = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { userData, hasPermission, loading: authLoading } = useEnhancedAuth();
  const { userStories, createNewStory, updateStoryData } = useEnhancedStory();

  const [isEditing, setIsEditing] = useState(false);
  const [storyStats, setStoryStats] = useState(null);

  // Check if user has permission to write
  useEffect(() => {
    if (!authLoading && !hasPermission("write")) {
      toast.error("You need to be a writer to access this page");
      navigate("/update-role");
    }
  }, [authLoading, hasPermission, navigate]);

  // Load story stats if editing
  useEffect(() => {
    if (storyId) {
      const story = userStories.find((s) => s.id === storyId);
      if (story) {
        setStoryStats({
          views: story.views || 0,
          likes: story.likes || 0,
          purchases: story.purchases || 0,
          earnings: story.earnings || 0,
          publishedAt: story.createdAt,
          lastModified: story.updatedAt,
        });
      }
    }
  }, [storyId, userStories]);

  const handlePublish = (publishedStory) => {
    toast.success("Story published successfully!");
    navigate(`/read/${publishedStory.id}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission("write")) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-32 px-4 text-center"
      >
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          🚫 Access Denied
        </h2>
        <p className="text-gray-700 mb-6">
          You need to be a <span className="font-semibold">Writer</span> to
          access this page.
        </p>
        <Button onClick={() => navigate("/update-role")}>
          Become a Writer
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="hover:bg-purple-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {storyId ? "Edit Story" : "Create New Story"}
                </h1>
                <p className="text-sm text-gray-600">
                  {storyId
                    ? "Update your masterpiece"
                    : "Start crafting your next masterpiece"}
                </p>
              </div>
            </div>

            {storyId && storyStats && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>{storyStats.views}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span>{storyStats.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>₹{storyStats.earnings}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Your Writing Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Stories Published
                    </span>
                    <Badge variant="secondary">
                      {
                        userStories.filter(
                          (s) => s.publishStatus === "published",
                        ).length
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <Badge variant="outline">
                      {userStories.reduce((sum, s) => sum + (s.views || 0), 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Likes</span>
                    <Badge variant="outline">
                      {userStories.reduce((sum, s) => sum + (s.likes || 0), 0)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Earnings
                    </span>
                    <Badge variant="destructive">
                      ₹
                      {userStories.reduce(
                        (sum, s) => sum + (s.earnings || 0),
                        0,
                      )}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Writing Tips */}
            <Card className="bg-white/80 backdrop-blur-md shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Writing Tips
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Start with a compelling hook to grab readers' attention
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use descriptive language to create vivid imagery</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Break up long paragraphs for better readability</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Add relevant tags to improve discoverability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Stories */}
            {userStories.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-md shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Recent Stories
                  </h3>
                  <div className="space-y-3">
                    {userStories.slice(0, 3).map((story) => (
                      <div
                        key={story.id}
                        className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => navigate(`/read/${story.id}`)}
                      >
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              story.publishStatus === "published"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {story.publishStatus}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {story.views || 0} views
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Editor */}
          <div className="lg:col-span-3">
            <EnhancedStoryEditor storyId={storyId} onPublish={handlePublish}  />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedWrite;
