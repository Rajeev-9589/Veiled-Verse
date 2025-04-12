// src/components/layouts/WriteFlowLayout.jsx
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const WriteFlowLayout = ({ children, title = "Write Flow", showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 pt-24 px-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            {title}
          </h1>
          {showBack && (
            <Button variant="outline" onClick={() => navigate(-1)}>
              ← Back
            </Button>
          )}
        </div>

        {children}
      </motion.div>
    </div>
  );
};

export default WriteFlowLayout;
