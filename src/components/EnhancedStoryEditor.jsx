import React, { useState, useEffect, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import CodeBlock from "@tiptap/extension-code-block";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Quote,
  List,
  ListOrdered,
  Save,
  Eye,
  Settings,
  Download,
  Upload,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { useEnhancedStory } from "@/contexts/EnhancedStoryContext";
import { toast } from "sonner";
import Toolbar from "./Toolbar";

const EnhancedStoryEditor = ({ storyId = null, onSave, onPublish }) => {
  const { userData, hasPermission } = useEnhancedAuth();
  const { createNewStory, updateStoryData, userStories } = useEnhancedStory();

  // Form state
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [publishStatus, setPublishStatus] = useState("draft"); // draft, published, private

  // Editor state
  const [isPreview, setIsPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [collaborationEnabled, setCollaborationEnabled] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Auto-save state
  const autoSaveRef = useRef(null);
  const lastSavedRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Enhanced editor with more extensions
  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      Placeholder.configure({
        placeholder:
          "Start writing your masterpiece... Let your imagination flow freely.",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 p-4 rounded-lg font-mono text-sm",
        },
      }),
    ],
    content: "<p>Start writing your masterpiece...</p>",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      const text = editor.getText();
      const words = text.split(/\s+/).filter((word) => word.length > 0).length;
      setWordCount(words);
      setReadingTime(Math.ceil(words / 200)); // Average reading speed

      if (autoSaveEnabled) {
        scheduleAutoSave();
      }
    },
  });

  // Auto-save functionality
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }

    autoSaveRef.current = setTimeout(() => {
      saveDraft();
    }, 3000); // Auto-save after 3 seconds of inactivity
  }, []);

  const saveDraft = useCallback(async () => {
    if (!editor || !title.trim()) return;

    setIsSaving(true);
    try {
      const draftData = {
        title,
        genre,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        description,
        content: editor.getHTML(),
        isPaid,
        price: isPaid ? Number(price) : 0,
        coverImage,
        publishStatus,
        wordCount,
        readingTime,
        lastModified: new Date(),
      };

      // Save to localStorage for backup
      localStorage.setItem(
        `story_draft_${storyId || "new"}`,
        JSON.stringify(draftData),
      );

      // If editing existing story, update it
      if (storyId) {
        await updateStoryData(storyId, draftData);
      }

      setLastSaved(new Date());
      lastSavedRef.current = new Date();
      toast.success("Draft saved automatically");
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  }, [
    editor,
    title,
    genre,
    tags,
    description,
    isPaid,
    price,
    coverImage,
    publishStatus,
    wordCount,
    readingTime,
    storyId,
    updateStoryData,
  ]);

  // Load existing story or draft
  useEffect(() => {
    if (storyId) {
      const existingStory = userStories.find((story) => story.id === storyId);
      if (existingStory) {
        setTitle(existingStory.title || "");
        setGenre(existingStory.genre || "");
        setTags(existingStory.tags?.join(", ") || "");
        setDescription(existingStory.description || "");
        setIsPaid(existingStory.isPaid || false);
        setPrice(existingStory.price?.toString() || "");
        setCoverImage(existingStory.coverImage || "");
        setPublishStatus(existingStory.publishStatus || "draft");
        if (editor) {
          editor.commands.setContent(
            existingStory.content || "<p>Start writing your masterpiece...</p>",
          );
        }
      }
    } else {
      // Load draft from localStorage
      const saved = localStorage.getItem("story_draft_new");
      if (saved && editor) {
        const parsed = JSON.parse(saved);
        setTitle(parsed.title || "");
        setGenre(parsed.genre || "");
        setTags(parsed.tags?.join(", ") || "");
        setDescription(parsed.description || "");
        setIsPaid(parsed.isPaid || false);
        setPrice(parsed.price?.toString() || "");
        setCoverImage(parsed.coverImage || "");
        setPublishStatus(parsed.publishStatus || "draft");
        editor.commands.setContent(
          parsed.content || "<p>Start writing your masterpiece...</p>",
        );
      }
    }
  }, [storyId, userStories, editor]);

  // Enhanced publish function
  const handlePublish = useCallback(async () => {
    if (!editor || !title.trim() || !editor.getText().trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    if (!hasPermission("publish")) {
      toast.error("You don't have permission to publish stories");
      return;
    }

    try {
      const storyData = {
        title: title.trim(),
        genre: genre.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        description: description.trim(),
        content: editor.getHTML(),
        isPaid,
        price: isPaid ? Number(price) : 0,
        coverImage,
        publishStatus: "published",
        wordCount,
        readingTime,
        estimatedEarnings: isPaid ? Math.ceil(wordCount / 100) * 0.1 : 0, // Rough estimate
      };

      let result;
      if (storyId) {
        result = await updateStoryData(storyId, storyData);
      } else {
        result = await createNewStory(storyData);
      }

      if (result) {
        // Clear draft
        localStorage.removeItem(`story_draft_${storyId || "new"}`);
        toast.success("Story published successfully!");

        if (onPublish) {
          onPublish(result);
        }
      }
    } catch (error) {
      console.error("Error publishing story:", error);
      toast.error("Failed to publish story");
    }
  }, [
    editor,
    title,
    genre,
    tags,
    description,
    isPaid,
    price,
    coverImage,
    wordCount,
    readingTime,
    storyId,
    hasPermission,
    updateStoryData,
    createNewStory,
    onPublish,
  ]);

  // Export/Import functionality
  const exportStory = useCallback(() => {
    if (!editor) return;

    const storyData = {
      title,
      genre,
      tags,
      description,
      content: editor.getHTML(),
      isPaid,
      price,
      coverImage,
      wordCount,
      readingTime,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(storyData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Story exported successfully");
  }, [
    editor,
    title,
    genre,
    tags,
    description,
    isPaid,
    price,
    coverImage,
    wordCount,
    readingTime,
  ]);

  const importStory = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const storyData = JSON.parse(e.target.result);
          setTitle(storyData.title || "");
          setGenre(storyData.genre || "");
          setTags(storyData.tags || "");
          setDescription(storyData.description || "");
          setIsPaid(storyData.isPaid || false);
          setPrice(storyData.price?.toString() || "");
          setCoverImage(storyData.coverImage || "");
          if (editor) {
            editor.commands.setContent(
              storyData.content || "<p>Start writing your masterpiece...</p>",
            );
          }
          toast.success("Story imported successfully");
        } catch (error) {
          console.error("Error importing story:", error);
          toast.error("Failed to import story");
        }
      };
      reader.readAsText(file);
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 pt-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-screen-2xl px-8 py-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              {storyId ? "Edit Story" : "Write Your Story"}
            </h1>
            <p className="text-gray-600 mt-2">
              Craft your masterpiece with our enhanced editor
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              disabled={!editor}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? "Back to Edit" : "Preview"}
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{wordCount} words</span>
              </div>
              {isPaid && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>₹{price}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isSaving && <span className="text-blue-600">Saving...</span>}
              {lastSaved && (
                <span className="text-green-600">
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {isPreview ? (
          <Card className="bg-white/90 shadow-xl">
            <CardContent className="p-8">
              {!editor ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading preview...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-4">
                    {title || "Untitled Story"}
                  </h2>
                  <div className="flex gap-2 mb-4">
                    {genre && <Badge variant="secondary">{genre}</Badge>}
                    {isPaid && <Badge variant="destructive">₹{price}</Badge>}
                    {tags &&
                      tags.split(",").map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                  </div>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        editor.getHTML() ||
                        "<p>Start writing your story...</p>",
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Form */}
            <div className="lg:w-1/3 space-y-4">
              <Card className="bg-white/80 backdrop-blur-md shadow-lg">
                <CardContent className="p-6 space-y-4">
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your story"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
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

                  <div>
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      placeholder="https://example.com/image.jpg"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <Label htmlFor="paid-toggle">Paid Story</Label>
                    <Switch
                      id="paid-toggle"
                      checked={isPaid}
                      onCheckedChange={setIsPaid}
                    />
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

                  <div>
                    <Label htmlFor="publishStatus">Publish Status</Label>
                    <select
                      id="publishStatus"
                      value={publishStatus}
                      onChange={(e) => setPublishStatus(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={saveDraft}
                      disabled={isSaving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={handlePublish} disabled={isSaving}>
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Export/Import */}
              <Card className="bg-white/80 backdrop-blur-md shadow-lg">
                <CardContent className="p-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportStory}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Story
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importStory}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Editor */}
            <div className="flex-1 space-y-4">
              {/* Toolbar */}
              <Card className="bg-white/90 shadow-lg">
                <CardContent className="p-4">
                  <Toolbar editor={editor} />
                </CardContent>
              </Card>

              {/* Editor Content */}
              <Card className="bg-white/90 shadow-lg">
                <CardContent className="p-8">
                  <EditorContent
                    editor={editor}
                    className="prose prose-lg max-w-none min-h-[60vh] focus:outline-none"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editor Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave">Auto Save</Label>
                <Switch
                  id="autoSave"
                  checked={autoSaveEnabled}
                  onCheckedChange={setAutoSaveEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="collaboration">Collaboration Mode</Label>
                <Switch
                  id="collaboration"
                  checked={collaborationEnabled}
                  onCheckedChange={setCollaborationEnabled}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default EnhancedStoryEditor;
