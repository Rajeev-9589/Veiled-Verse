import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import { Switch } from "@/components/ui/switch";
import ReadingPreview from "@/components/ReadingPreview";
import { db } from "../../Backend/firebase/auth/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import {
  PenTool,
  Eye,
  Save,
  Upload,
  Sparkles,
  BookOpen,
  Tag,
  DollarSign,
} from "lucide-react";

const Write = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const { user, userData, loading } = useEnhancedAuth();
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit, CharacterCount],
    content: "<p>Start writing your masterpiece...</p>",
  });

  useEffect(() => {
    const saved = localStorage.getItem("story_draft");
    if (saved && editor) {
      const parsed = JSON.parse(saved);
      setTitle(parsed.title || "");
      setGenre(parsed.genre || "");
      setTags(parsed.tags || "");
      setIsPaid(parsed.isPaid || false);
      setPrice(parsed.price || "");
      editor.commands.setContent(
        parsed.content || "<p>Start writing your masterpiece...</p>",
      );
    }
  }, [editor]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!editor) return;
      localStorage.setItem(
        "story_draft",
        JSON.stringify({
          title,
          genre,
          tags,
          isPaid,
          price,
          content: editor.getHTML() || "",
        }),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [title, genre, tags, isPaid, price, editor]);

  const handleSaveDraft = () => {
    console.log("Draft Saved:", {
      title,
      genre,
      tags,
      isPaid,
      price,
      content: editor?.getHTML(),
    });
  };

  const handlePublish = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("You must be logged in to publish a story.");
        return;
      }

      if (!title.trim() || !editor?.getText().trim()) {
        alert("Title and content cannot be empty.");
        return;
      }

      const storyData = {
        title,
        genre,
        tags: tags.split(",").map((tag) => tag.trim()),
        isPaid,
        price: isPaid ? Number(price) : 0,
        content: editor.getHTML(),
        authorId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "stories"), storyData);

      localStorage.removeItem("story_draft");
      alert("Story published successfully!");

      // Reset form
      setTitle("");
      setGenre("");
      setTags("");
      setIsPaid(false);
      setPrice("");
      editor.commands.setContent("<p>Start writing your masterpiece...</p>");

      navigate("/dashboard"); // optional: redirect after publish
    } catch (error) {
      console.error("Error publishing story:", error);
      alert("Failed to publish story. Please try again.");
    }
  };

  if (loading)
    return <div className="text-center mt-20">Checking access...</div>;

  if (!user || !userData?.roles?.includes("writer")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-20">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-full opacity-20 blur-xl"
          />
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-20 blur-xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md mx-auto text-center px-4"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🚫</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text mb-4">
              Access Denied
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              You need to be a{" "}
              <span className="font-semibold text-purple-600">Writer</span> to
              access this page.
            </p>
            <Button
              onClick={() => navigate("/update-role")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Become a Writer
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 pt-20">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-32 left-16 w-24 h-24 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-48 right-24 w-36 h-36 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-br from-indigo-300 to-pink-300 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 18, 0],
            x: [0, -12, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-1/4 w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-screen-2xl px-4 lg:px-8 py-8"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-transparent bg-clip-text"
            >
              <PenTool className="inline-block w-8 h-8 mr-3" />
              Write Your Story
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mt-2"
            >
              Create your masterpiece and share it with the world
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="bg-white/80 backdrop-blur-md border-white/20 hover:bg-white/90 transition-all duration-300"
            >
              {isPreview ? (
                <>
                  <PenTool className="w-4 h-4 mr-2" />
                  Back to Edit
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Story
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {isPreview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ReadingPreview
              title={title}
              genre={genre}
              tags={tags}
              isPaid={isPaid}
              price={price}
              content={editor.getHTML()}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Sidebar Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="xl:w-1/3 space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Story Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700"
                    >
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter your story title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="genre"
                      className="text-sm font-medium text-gray-700"
                    >
                      Genre
                    </Label>
                    <Input
                      id="genre"
                      placeholder="e.g. Romance, Thriller, Drama"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="mt-1 bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="tags"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tags
                    </Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="tags"
                        placeholder="e.g. love, adventure, mystery"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="mt-1 pl-10 bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="paid-toggle"
                        className="text-sm font-medium text-gray-700"
                      >
                        Paid Story
                      </Label>
                      <Switch
                        id="paid-toggle"
                        checked={isPaid}
                        onCheckedChange={setIsPaid}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>

                    {isPaid && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          className="pl-10 bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                          type="number"
                          placeholder="Price in ₹"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Actions
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-700">Auto Save</span>
                    </div>
                    <span className="text-xs text-green-600">Every 5s</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      className="flex-1 bg-white/50 border-gray-200 hover:bg-white/80"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={handlePublish}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Editor */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1"
            >
              <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 lg:p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <Label className="text-lg font-semibold text-gray-800">
                    Story Content
                  </Label>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {editor.storage.characterCount.characters() || 0} characters
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <EditorContent
                    editor={editor}
                    className="prose prose-lg max-w-none min-h-[60vh] p-6 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Write;
