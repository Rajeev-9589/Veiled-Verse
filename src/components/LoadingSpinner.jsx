import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner = ({
  size = "md",
  color = "purple",
  text = "Loading...",
  showText = true,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    purple: "border-purple-600",
    blue: "border-blue-600",
    green: "border-green-600",
    red: "border-red-600",
    gray: "border-gray-600",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-${colorClasses[color]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {showText && text && (
        <motion.p
          className="mt-4 text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
