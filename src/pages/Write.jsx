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
import { useUser } from "@/contexts/UserContext";

const Write = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const { user, userData, loading } = useUser();
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
      editor.commands.setContent(parsed.content || "<p>Start writing your masterpiece...</p>");
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
        })
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

  if (loading) return <div className="text-center mt-20">Checking access...</div>;

  if (!user || !userData?.roles?.includes("writer")) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-32 px-4 text-center"
      >
        <h2 className="text-2xl font-bold text-red-600 mb-4">🚫 Access Denied</h2>
        <p className="text-gray-700 mb-6">
          You need to be a <span className="font-semibold">Writer</span> to access this page.
        </p>
        <Button onClick={() => navigate("/update-role")}>Become a Writer</Button>
      </motion.div>
    );
  }

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 pt-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-screen-2xl px-8 py-10"
      >
        <div className="flex justify-between items-center pb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            Write Your Story
          </h1>
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? "Back to Edit" : "Preview Story"}
          </Button>
        </div>

        {isPreview ? (
          <ReadingPreview
            title={title}
            genre={genre}
            tags={tags}
            isPaid={isPaid}
            price={price}
            content={editor.getHTML()}
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Form */}
            <div className="lg:w-1/3 space-y-4 bg-white/80 backdrop-blur-md shadow-lg rounded-xl p-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter story title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  placeholder="e.g. Romance, Thriller, Drama"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g. love, adventure, mystery"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="paid-toggle">Is this story Paid?</Label>
                <Switch id="paid-toggle" checked={isPaid} onCheckedChange={setIsPaid} />
                {isPaid && (
                  <Input
                    className="w-28"
                    type="number"
                    placeholder="Price ₹"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2">
                  <Label>Auto Save</Label>
                  <span className="text-sm text-gray-500">(Every 5s)</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    Save Draft
                  </Button>
                  <Button onClick={handlePublish}>Publish</Button>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 bg-white/90 border rounded-xl shadow-xl p-8 overflow-y-auto max-h-[calc(100vh-160px)]">
              <Label className="text-lg font-semibold mb-2 block">Story Content</Label>
              <EditorContent
                editor={editor}
                className="prose prose-lg max-w-none min-h-[60vh] focus:outline-none"
              />
              <p className="text-sm text-gray-500 text-right pt-2">
                Word Count: {editor.storage.characterCount.characters() || 0}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Write;
