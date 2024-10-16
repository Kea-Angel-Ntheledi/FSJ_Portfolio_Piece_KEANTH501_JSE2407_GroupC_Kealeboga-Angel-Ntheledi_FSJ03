"use client";

import { useState, useEffect } from "react";
import { auth } from "../pages/api/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signin";

  // Redirect to home if user is already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/"); // Redirect if already logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(""); // Reset error message

    try {
      // Authenticate user based on mode (signup or signin)
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/"); // Redirect to home page on success
    } catch (err) {
      setError(err.message); // Show error message if authentication fails
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-pink-600">
          {mode === "signup" ? "Create Account" : "Welcome Back!"}
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleAuth} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-700 placeholder-pink-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-700 placeholder-pink-400"
            required
          />
          <button
            type="submit"
            className={`px-6 py-2 text-white font-semibold rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-pink-200 ${
              mode === "signup"
                ? "bg-green-500 hover:bg-green-400"
                : "bg-pink-500 hover:bg-pink-400"
            }`}
          >
            {mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-pink-700">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link
                href="/auth?mode=signin"
                className="text-pink-600 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don’t have an account yet?{" "}
              <Link
                href="/auth?mode=signup"
                className="text-pink-600 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
