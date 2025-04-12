import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoryContext } from "@/contexts/StoryContext";
import Confetti from "react-confetti";
import { useLocation } from "react-router-dom";

const Explore = () => {
  const { stories } = useContext(StoryContext);
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (location.state?.justSubscribed && location.state?.plan) {
      setShowConfetti(true);
      setModalMessage(`🎉 You are now a ${location.state.plan} member!`);

      setTimeout(() => {
        setShowConfetti(false);
        setModalMessage("");
        window.history.replaceState({}, document.title); // clears state after showing
      }, 5000);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 pt-5 px-4 pb-10">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      {modalMessage && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white/70 backdrop-blur-lg border border-purple-200 px-6 py-8 rounded-xl shadow-xl text-center max-w-sm w-full">
      <h2 className="text-2xl font-bold text-purple-600 mb-2">Thank You!</h2>
      <p className="text-lg">{modalMessage}</p>
    </div>
  </div>
)}

      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text p-4"
        >
          Explore Inspiring Stories
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-600 text-base md:text-lg"
        >
          Discover tales crafted by creative minds — from romance to thrillers.
        </motion.p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-white/70 shadow rounded-full px-4 py-2 text-sm text-gray-600">
          🔍 Filter by Genre — Coming soon...
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="bg-white/90 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 rounded-xl hover:scale-[1.02]">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">{story.title}</h2>
                  <div className="flex space-x-1">
                    {story.isFeatured && (
                      <Badge className="bg-yellow-100 text-yellow-800">🌟 Featured</Badge>
                    )}
                    {story.isPaid ? (
                      <Badge className="bg-red-100 text-red-600">💰 Paid</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-600">✅ Free</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{story.description}</p>
                <p className="text-xs text-gray-500 italic">by {story.author}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
