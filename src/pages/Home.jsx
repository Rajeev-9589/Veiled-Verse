import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, PencilLine } from "lucide-react";

const featuredStories = [
  {
    title: "Code of the Shadows",
    author: "Zayn Khan",
    genre: "Sci-Fi",
    description: "In a dystopian future, hackers become heroes.",
  },
  {
    title: "Whispers of the Night",
    author: "Aarav Mehta",
    genre: "Romance",
    description: "A tale of midnight love under a forgotten sky.",
  },
  {
    title: "The Forgotten Diary",
    author: "Mira Sharma",
    genre: "Mystery",
    description: "A dusty journal unlocks long-lost secrets of a village.",
  },
 
];

const HomeComponent = () => {
  return (
<div className="w-full min-h-screen bg-gradient-to-br from-amber-50 via-rose-100 to-orange-100 p-6">
Developed by <span className="text-purple-700 font-semibold">Rajeev</span>

      <div className="max-w-7xl mx-auto">
       {/* Hero Section */}
<motion.div
  className="relative text-center py-24 overflow-hidden"
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Floating glowing background element */}
  <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
    <div className="w-[600px] h-[600px] bg-rose-100 rounded-full blur-3xl opacity-40 animate-floating"></div>
  </div>

  {/* Content */}
  <div className="relative z-10">
    <motion.h1
      className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-6 leading-tight"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <span className="inline-block">
        <span className="flex items-baseline justify-center gap-1">
        Veiled Verse
        </span>
        
      </span>
    </motion.h1>

    <motion.p
      className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 border-l-4 border-pink-300 pl-4 italic"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
     A cosmos of hidden tales, waiting to be told. Read, write, and weave your magic
<span className="text-[9px] inline-block mt-2 text-gray-500 ">- Saranghaeyo😁  </span>
    </motion.p>

    <motion.div
      className="mt-6 flex justify-center gap-4 flex-wrap"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <Button
        asChild
        size="lg"
        className="gap-2 shadow-md hover:shadow-xl transition-all"
      >
        <Link to="/explore">
          <BookOpen size={18} /> Explore Stories
        </Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="gap-2 shadow-md hover:shadow-xl transition-all"
      >
        <Link to="/write">
          <PencilLine size={18} /> Start Writing
        </Link>
      </Button>
    </motion.div>
  </div>
</motion.div>


        {/* Featured Stories */}
        <motion.div
          className="mt-24"
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
          <h2 className="text-4xl font-bold mb-10 text-center text-purple-700">
            Featured Stories
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredStories.map((story, index) => (
              <motion.div
                key={index}
                className="w-full"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="shadow-xl border border-purple-200 hover:shadow-purple-300 transition-shadow bg-white">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-2xl font-semibold text-purple-800">
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      By <span className="font-medium">{story.author}</span> •{" "}
                      <span className="italic">{story.genre}</span>
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {story.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
    </div>
  );
};

export default HomeComponent;
