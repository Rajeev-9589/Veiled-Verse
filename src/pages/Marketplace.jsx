import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getPaidStories } from "@/components/utils/storyHelper";
import { StoryContext } from "@/contexts/StoryContext";
import BuyModal from "@/components/BuyModal";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // SoonER modal components

const Marketplace = () => {
  const { stories, buyStory, purchasedStories } = useContext(StoryContext);
  const [selectedStory, setSelectedStory] = useState(null);
  const { userData, loading: authLoading } = useAuth();

  const paidStories = getPaidStories(stories);

  return (
    <div className="min-h-screen pt-5 px-6 pb-16 bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text p-4"
        >
          Story Marketplace
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600 text-base md:text-lg"
        >
          Buy premium stories or read amazing free tales by our talented writers.
        </motion.p>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {paidStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur shadow-lg rounded-xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">{story.title}</h2>
                  <Badge className="bg-purple-100 text-purple-700">{story.genre}</Badge>
                </div>
                <p className="text-sm text-gray-600">{story.description}</p>
                <p className="text-xs italic text-gray-500">by {story.author}</p>

                {story.isFeatured && (
                  <Badge className="bg-yellow-100 text-yellow-800">🌟 Featured</Badge>
                )}
                <Badge className="bg-red-100 text-red-700">💰 Paid</Badge>

                <div className="flex justify-between items-center mt-3">
                  <span
                    className={`text-sm font-medium ${story.price === "Free" ? "text-green-600" : "text-pink-600"}`}
                  >
                    ₹{story.price}
                  </span>
                  <div className="flex gap-2">
                    <Link to={`/preview/${story.id}`}>
                      <Button size="sm" variant="outline">Preview</Button>
                    </Link>

                    {/* <Button
                      size="sm"
                      onClick={() => {
                        if (!userData) {
                          // If not logged in, redirect to login
                          window.location.href = "/login";
                          return;
                        }

                        // If logged in, show the modal
                        setSelectedStory(story);
                      }}
                      disabled={purchasedStories.includes(story.id)}
                      className={purchasedStories.includes(story.id) ? "opacity-50 cursor-not-allowed" : ""}
                    >
                      {purchasedStories.includes(story.id) ? "Purchased" : "Buy"}
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Buy Modal */}
      {selectedStory && (
        <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <p>This story costs ₹{selectedStory.price}. Do you want to proceed?</p>
            </DialogHeader>
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="ghost" onClick={() => setSelectedStory(null)}>Cancel</Button>
              <Button onClick={() => {
                buyStory(selectedStory.id);  // Handle the purchase
                setSelectedStory(null);  // Close the modal
              }}>Yes, Buy Now</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Marketplace;
