import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // SoonER modal components
import { StoryContext } from "../contexts/StoryContext";
import ReadingPreview from "./ReadingPreview";

const StoryPreview = () => {
  const { id } = useParams();
  const { stories, buyStory, purchasedStories } = useContext(StoryContext);
  const navigate = useNavigate();

  // Ensure the story is retrieved correctly based on the ID
  const story = stories.find((s) => s.id === id);

  // Show a loading indicator if the story is not found
  if (!story) return <div className="pt-28 text-center">Loading story...</div>;

  const [open, setOpen] = useState(false);

  const handleBuy = () => {
    buyStory(id);  // Buy the story and add it to purchased stories
    setOpen(false);
    navigate(`/read/${id}`);  // Navigate to the read page after purchase
  };

  return (
    <div className="min-h-screen pt-28 px-6 pb-16 bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-white/90 shadow-xl rounded-xl">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-3xl font-bold text-purple-700">{story.title}</h1>
            <p className="text-sm text-gray-500">by {story.author}</p>
            <p className="text-sm italic text-purple-700">Genre: {story.genre}</p>
            <p className="text-gray-700 mt-4">{story.description}</p>

            <div className="mt-6 flex gap-4">
              {story.isFree || purchasedStories.includes(id) ? (
                <Button onClick={() => navigate(`/read/${id}`)}>Start Reading</Button>
              ) : (
                <>
                  <Button onClick={() => setOpen(true)}>Buy to Read</Button>
                  <Button variant="outline" onClick={() => navigate("/Marketplace")}>Back</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <p>This story costs ₹{story.price}. Do you want to proceed?</p>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleBuy}>Yes, Buy Now</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* <ReadingPreview
        title={story.title}
        genre={story.genre}
        tags={story.tags}
        isPaid={story.isPaid}
        price={story.price}
        content={story.content}
      /> */}
    </div>
    
  );
};

export default StoryPreview;
