// src/Routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute;
