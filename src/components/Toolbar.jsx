import React from "react";
import { Button } from "@/components/ui/button";

const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const toggle = (command) => () => editor.chain().focus()[command]().run();
  const isActive = (command) => editor.isActive(command);

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button
        size="sm"
        variant={isActive("bold") ? "default" : "outline"}
        onClick={toggle("toggleBold")}
      >
        B
      </Button>
      <Button
        size="sm"
        variant={isActive("italic") ? "default" : "outline"}
        onClick={toggle("toggleItalic")}
      >
        I
      </Button>
      <Button
        size="sm"
        variant={isActive("underline") ? "default" : "outline"}
        onClick={toggle("toggleUnderline")}
      >
        U
      </Button>
      <Button
        size="sm"
        variant={isActive("strike") ? "default" : "outline"}
        onClick={toggle("toggleStrike")}
      >
        S
      </Button>
      <Button
        size="sm"
        variant={isActive("heading", { level: 1 }) ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>
      <Button
        size="sm"
        variant={isActive("bulletList") ? "default" : "outline"}
        onClick={toggle("toggleBulletList")}
      >
        • List
      </Button>
      <Button
        size="sm"
        variant={isActive("codeBlock") ? "default" : "outline"}
        onClick={toggle("toggleCodeBlock")}
      >
        Code
      </Button>
      <Button
        size="sm"
        onClick={() => {
          const url = prompt("Enter image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        Image
      </Button>
    </div>
  );
};

export default Toolbar;
