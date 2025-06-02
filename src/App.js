// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import VerifyEmail from "./components/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import ToDoPage from "./components/ToDoPage";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected home: only authenticated & verified */}
      <Route
        path="/"
        element={
          <ProtectedRoute requireEmailVerified={true}>
            <ToDoPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback: redirect everything else to “/” */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
