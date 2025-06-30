// src/Routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useEnhancedAuth } from "@/contexts/EnhancedAuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useEnhancedAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute;
