import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Heart, Bookmark } from "lucide-react";
import { db } from "../../Backend/firebase/auth/auth";
import { doc, getDoc } from "firebase/firestore";

const ReadingPreview = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Story ID from URL:", id);
  useEffect(() => {
    const fetchStory = async () => {
      try {
        console.log("Fetching story with ID:", id);
        const storyRef = doc(db, "stories", id);
        const docSnap = await getDoc(storyRef);
  
        if (docSnap.exists()) {
          setLoading(false)
          setStory(docSnap.data());
          console.log(docSnap.data());
        } else {
          setError("Story not found");
        }
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("Failed to fetch story");
      }
    };
  
    if (id) fetchStory();
  }, [id]);

  const calculateReadingTime = (htmlContent) => {
    const text = htmlContent?.replace(/<[^>]+>/g, "") || "";
    const wordCount = text.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const time = Math.ceil(wordCount / wordsPerMinute);
    return `${time || 1} min read`;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  const { title, genre, tags, isPaid, price, content, authorName } = story;
  const readingTime = calculateReadingTime(content);

  return (
    <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl px-6 py-10 max-w-4xl mx-auto my-8 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            {title || "Untitled Story"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            By {authorName || "Ankahee Author"}
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
            <Clock size={14} /> {readingTime}
          </span>
          <button className="flex items-center gap-1 text-pink-600 hover:text-pink-800 transition-colors">
            <Heart size={16} /> Like
          </button>
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
            <Bookmark size={16} /> Save
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4 justify-center sm:justify-start">
        {genre && (
          <span className="bg-purple-100 px-3 py-1 rounded-full font-medium">
            {genre}
          </span>
        )}
        {tags ? (
          tags
            .toString()
            .split(",")
            .map((tag, idx) => (
              <span
                key={idx}
                className="bg-pink-100 px-3 py-1 rounded-full font-medium"
              >
                {tag.trim()}
              </span>
            ))
        ) : (
          <span className="text-gray-400">No tags available</span>
        )}
        <span
          className={`px-3 py-1 rounded-full font-medium ${
            isPaid ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
          }`}
        >
          {isPaid ? `Paid • ₹${price || 0}` : "Free to read"}
        </span>
      </div>

      {/* Story Content */}
      <div className="prose prose-lg font-serif text-gray-800 max-w-none pt-6">
        <div
          dangerouslySetInnerHTML={{
            __html: content || "<p>No content available</p>",
          }}
        />
      </div>
    </div>
  );
};

export default ReadingPreview;
