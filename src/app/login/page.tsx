"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError("Please provide both email/username and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        identifier, // username or email
        password,
        redirect: false,
      });

      if (res?.ok) {
        setShowSuccessPopup(true);
        setTimeout(async () => {
          // ✅ Get current session (contains user + role)
          const session = await getSession();
          const role = session?.user?.role as "worker" | "user" | undefined;

          // ✅ Redirect based on role
          if (role === "worker") {
            router.replace("/worker-dashboard");
          } else {
            router.replace("/user-dashboard");
          }
        }, 1500); // Wait 1.5 seconds before redirecting
        return;
      }

      if (res?.error) {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("LOGIN_ERROR:", err);
      setError("An error occurred during login.");
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
              <p className="font-semibold text-gray-800">Login Successful!</p>
              <p className="text-sm text-gray-600">Redirecting...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 w-11/12 sm:w-4/5 lg:max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-white/20 backdrop-blur-lg border border-white/40 hover:border-white/60 transition-all duration-300 transform hover:scale-[1.02]">
        {/* Left side */}
        <div className="bg-black bg-opacity-80 flex items-center justify-center p-6">
          <div className="text-white text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome Back!</h2>
            <p className="text-sm sm:text-base">
              Login to continue using our services.
            </p>
            <p className="text-xs sm:text-sm">
              Fast and reliable service for your home needs.
            </p>
          </div>
        </div>

        {/* Right side - form */}
        <div className="flex items-center justify-center p-6">
          <form
            className="w-full space-y-4 bg-white/40 backdrop-blur-lg rounded-xl p-6 border border-white/30 shadow-md"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-center text-black mb-2">
              Login
            </h2>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/60 text-black placeholder-gray-800 transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e61717] bg-white/60 text-black placeholder-gray-800 transition"
            />

            <div className="flex items-center justify-between text-sm">
              <Link href="#" className="text-[#e61717] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-[#e61717] transition shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && !showSuccessPopup && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              {loading && showSuccessPopup ? "Success!" : "Login"}
            </button>

            <p className="text-center text-sm text-black/80 mt-2">
              New account?{" "}
              <Link href="/sign-up" className="text-[#e61717] hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
