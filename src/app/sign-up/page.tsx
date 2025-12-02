"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SignupPage() {
  type Role = "user" | "worker";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>("user");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      const contentType = res.headers.get("content-type");

      if (res.ok) {
        const data = await res.json();
        setShowSuccessPopup(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // Wait 2 seconds before redirecting
      } else {
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await res.json();
            alert(errorData.message || "An error occurred");
          } catch (e) {
            const errorText = await res.text();
            console.error("Error Text:", errorText);
            alert("An unexpected error occurred. Please check the console.");
          }
        } else {
          const errorText = await res.text();
          console.error("Error Text:", errorText);
          alert("An unexpected error occurred. Please check the console.");
        }
      }
    } catch (error) {
      console.error("SIGNUP_ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/image/login.jpg')" }}
    >
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 p-4 bg-white rounded-xl shadow-2xl border border-green-200"
          >
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="font-semibold text-gray-800">Sign Up Successful!</p>
              <p className="text-sm text-gray-600">Redirecting to login...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 w-11/12 sm:w-4/5 lg:max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-white/20 backdrop-blur-lg border border-white/40 hover:border-white/60 transition-all duration-300 transform hover:scale-[1.02]">
        <div className="bg-[#e61717] bg-opacity-90 flex items-center justify-center p-6">
          <div className="text-white text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Join UrbanSetGo</h2>
            <p className="text-sm sm:text-base">
              Create an account to book services instantly.
            </p>
            <p className="text-xs sm:text-sm">
              Quick, easy, and reliable signup.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6">
          <form
            className="w-full space-y-4 bg-white/40 backdrop-blur-lg rounded-xl p-6 border border-white/30 shadow-md"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-center text-black mb-2">
              Sign Up
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/60 text-black placeholder-gray-800 transition"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/60 text-black placeholder-gray-800 transition"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full p-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/60 text-black"
            >
              <option value="user">User</option>
              <option value="worker">Worker</option>
            </select>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/60 text-black placeholder-gray-800 transition"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/60 text-black placeholder-gray-800 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-[#e61717] transition shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-center text-sm text-black/80 mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#e61717] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
