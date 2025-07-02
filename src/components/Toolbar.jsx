import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateUrl } from "../utils/security";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  List,
  Code,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
} from "lucide-react";

const Toolbar = ({ editor }) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  if (!editor) return null;

  const toggle = (command) => () => editor.chain().focus()[command]().run();
  const isActive = (command) => editor.isActive(command);

  const handleImageAdd = () => {
    const validation = validateUrl(imageUrl);
    if (!validation.isValid) {
      setImageError(validation.error);
      return;
    }

    editor.chain().focus().setImage({ src: validation.sanitizedUrl }).run();
    setImageUrl("");
    setImageError("");
    setShowImageDialog(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={isActive("bold") ? "default" : "outline"}
          onClick={toggle("toggleBold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("italic") ? "default" : "outline"}
          onClick={toggle("toggleItalic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("underline") ? "default" : "outline"}
          onClick={toggle("toggleUnderline")}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("strike") ? "default" : "outline"}
          onClick={toggle("toggleStrike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("heading", { level: 1 }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("bulletList") ? "default" : "outline"}
          onClick={toggle("toggleBulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("orderedList") ? "default" : "outline"}
          onClick={toggle("toggleOrderedList")}
          title="Numbered List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("codeBlock") ? "default" : "outline"}
          onClick={toggle("toggleCodeBlock")}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive("blockquote") ? "default" : "outline"}
          onClick={toggle("toggleBlockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive({ textAlign: "left" }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive({ textAlign: "center" }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant={isActive({ textAlign: "right" }) ? "default" : "outline"}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => setShowImageDialog(true)}
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Secure Image URL Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="image-url" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleImageAdd();
                  }
                }}
              />
              {imageError && (
                <p className="text-sm text-red-600">{imageError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl("");
                  setImageError("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleImageAdd}
                className="flex-1"
              >
                Add Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Toolbar;
