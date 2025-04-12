// src/pages/UpdateRole.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Backend/firebase/auth/auth";
import { useNavigate } from "react-router-dom";

const UpdateRole = () => {
  const { user, userData, setUserData } = useUser();
  const navigate = useNavigate();

  const handleBecomeWriter = async () => {
    if (!user) return alert("Please log in first.");
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        roles: userData?.roles?.includes("writer")
          ? userData.roles
          : [...(userData?.roles || []), "writer"],
      });
      setUserData((prev) => ({
        ...prev,
        roles: [...(prev?.roles || []), "writer"],
      }));
      alert("You're now a Writer!");
      navigate("/write");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-200 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-purple-700 mb-6">Want to Write Stories?</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Upgrade your profile to become a <strong>Writer</strong> and start publishing your own stories on AnkaheeVerse.
      </p>
      <Button onClick={handleBecomeWriter} size="lg">
        Become a Writer 🚀
      </Button>
    </motion.div>
  );
};

export default UpdateRole;
