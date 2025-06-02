// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, requireEmailVerified = false }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Not signed in → send to /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireEmailVerified && !currentUser.emailVerified) {
    // Signed in but not verified → send to /verify-email
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return children;
}
