// src/components/Signup.js
import React, { useRef, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const displayName = displayNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

    if (!displayName) {
      return setError("Please enter a display name.");
    }
    if (!email.endsWith("@gmail.com")) {
      return setError("Only @gmail.com addresses are allowed.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);

      // 1) Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2) Set display name
      await updateProfile(userCredential.user, { displayName });

      // 3) Send verification email
      await sendEmailVerification(userCredential.user);

      alert("Verification email sent! Please check your Gmail inbox.");

      navigate("/verify-email");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-gray-700">Display Name</label>
            <input
              type="text"
              ref={displayNameRef}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email (Gmail only) */}
          <div>
            <label className="block text-gray-700">Email (@gmail.com only)</label>
            <input
              type="email"
              ref={emailRef}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              ref={passwordRef}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
