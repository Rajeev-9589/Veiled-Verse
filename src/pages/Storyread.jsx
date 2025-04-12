import React, { useEffect, useRef, useState, useContext } from "react";
import ReadingPreview from "../components/ReadingPreview";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { StoryContext } from "../contexts/StoryContext"; // Import context

const StoryRead = () => {
  const { stories } = useContext(StoryContext);  // Get stories from context
  const contentRef = useRef(null);
  const [selectionCoords, setSelectionCoords] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([])
  const [noteInput, setNoteInput] = useState("");
  const [showNotesPanel, setShowNotesPanel] = useState(false);

  // Handle mouse selection for highlights and notes
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim() === "") {
        setSelectionCoords(null);
        return;
      }
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionCoords({
        text: selection.toString(),
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX + rect.width / 2
      });
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleHighlight = () => {
    if (!selectionCoords) return;
    setHighlights((prev) => [...prev, selectionCoords]);
    setSelectionCoords(null);
  };

  const handleAddNote = () => {
    if (!selectionCoords) return;
    const noteText = prompt("Add a note:");
    if (noteText) {
      setNotes((prev) => [...prev, { ...selectionCoords, note: noteText }]);
    }
    setSelectionCoords(null);
  };

  return (
    <div className="relative py-24 px-4 lg:px-24 min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      {/* Rendering Story */}
      {stories.length > 0 && (
        <ReadingPreview {...stories[0]} />  
      )}

      {/* Floating Buttons for Highlights and Notes */}
      <AnimatePresence>
        {selectionCoords && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 flex gap-2"
            style={{ top: selectionCoords.top - 40, left: selectionCoords.left }}
          >
            <Button
              size="sm"
              variant="secondary"
              className="text-xs px-2 py-1"
              onClick={handleHighlight}
            >
              ✨ Highlight
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-xs px-2 py-1"
              onClick={handleAddNote}
            >
              📝 Add Note
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes / Highlights Panel */}
      <motion.div
        initial={false}
        animate={{ right: showNotesPanel ? 0 : -300 }}
        className="fixed top-24 right-0 w-72 h-[calc(100vh-6rem)] bg-white shadow-lg border-l px-4 py-6 overflow-y-auto z-40"
      >
        <h3 className="text-lg font-semibold mb-4">Highlights & Notes</h3>
        {highlights.map((h, idx) => (
          <div key={idx} className="text-sm mb-3">
            <span className="font-medium">Highlight:</span> {h.text}
          </div>
        ))}
        {notes.map((n, idx) => (
          <div key={idx} className="text-sm mb-4">
            <span className="font-medium">Note on "{n.text}":</span>
            <p className="pl-2 text-gray-600">{n.note}</p>
          </div>
        ))}
      </motion.div>

      <Button
        className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-purple-500 text-white rounded-l-xl"
        onClick={() => setShowNotesPanel((prev) => !prev)}
      >
        {showNotesPanel ? "→" : "←"}
      </Button>
    </div>
  );
};

export default StoryRead;
