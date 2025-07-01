// src/Routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useEnhancedAuth();
  const location = useLocation();

  if (loading) return  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
    <LoadingSpinner />
  </div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute;
