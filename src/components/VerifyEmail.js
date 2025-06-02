// src/components/VerifyEmail.js
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useAuth } from "./AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmail() {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.emailVerified) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleResend = async () => {
    setSending(true);
    try {
      await sendEmailVerification(currentUser);
      setMessage("Verification email sent. Check your inbox.");
    } catch (err) {
      setMessage("Error sending email: " + err.message);
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">
          We’ve sent a verification link to{" "}
          <span className="font-medium">{currentUser?.email}</span>.<br />
          Please check your Gmail inbox (or spam folder) and click the link.
        </p>
        {message && (
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4">
            {message}
          </div>
        )}
        <button
          onClick={handleResend}
          disabled={sending}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {sending ? "Sending..." : "Resend Email"}
        </button>
        <p className="text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-purple-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
