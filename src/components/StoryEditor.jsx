// StoryEditor.jsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import { Button } from "@/components/ui/button";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-purple-200" : ""}
      >
        Bold
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-purple-200" : ""}
      >
        Italic
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-purple-200" : ""}
      >
        Underline
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? "bg-purple-200" : ""
        }
      >
        H1
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 }) ? "bg-purple-200" : ""
        }
      >
        H2
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-purple-200" : ""}
      >
        • List
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-purple-200" : ""}
      >
        1. List
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-purple-200" : ""}
      >
        Blockquote
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "bg-purple-200" : ""}
      >
        Code
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </Button>
      <Button
        variant="outline"
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </Button>
    </div>
  );
};

const StoryEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      History,
    ],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[300px] prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none"
      />
    </div>
  );
};

export default StoryEditor;
