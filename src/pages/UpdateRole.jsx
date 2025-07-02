// src/pages/UpdateRole.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Backend/firebase/auth/auth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const UpdateRole = () => {
  const { user, userData, updateUserData } = useEnhancedAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const handleBecomeWriter = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        roles: userData?.roles?.includes("writer")
          ? userData.roles
          : [...(userData?.roles || []), "writer"],
        updatedAt: new Date(),
      });
      await updateUserData({
        roles: [...(userData?.roles || []), "writer"],
      });
      toast.success("You're now a Writer!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-200 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-purple-700 mb-6">
        Want to Write Stories?
      </h1>
      <p className="text-lg text-gray-700 mb-8 max-w-md">
        Upgrade your profile to become a <strong>Writer</strong> and start
        publishing your own stories on Veiled Verse.
      </p>
      <Button onClick={handleBecomeWriter} size="lg" disabled={loading}>
        Become a Writer 🚀
      </Button>
    </motion.div>
  );
};

export default UpdateRole;
