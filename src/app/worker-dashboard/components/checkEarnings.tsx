"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Wallet, X, Loader2 } from "lucide-react"; // added professional icons

interface CheckEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Earning {
  date: string;
  jobTitle: string;
  amount: number;
  status: "Completed" | "Pending";
}

export default function CheckEarningsModal({
  isOpen,
  onClose,
}: CheckEarningsModalProps) {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchEarnings = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/workers/earnings");
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.message || "Failed to fetch earnings.");
          }
          setEarnings(result.earnings);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred."
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchEarnings();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#181818] rounded-2xl p-6 w-[90%] md:w-[500px] text-white border border-gray-700 shadow-2xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <Wallet size={22} className="text-[#e61717]" />
                <h2 className="text-xl font-semibold text-white">
                  Earnings Summary
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Earning List */}
            <div className="max-h-[300px] overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="animate-spin text-[#e61717]" />
                </div>
              ) : error ? (
                <p className="text-red-400 text-center">{error}</p>
              ) : (
                earnings.map((earning, i) => (
                  <motion.div
                    key={i}
                    className="flex justify-between items-center bg-[#202020] p-3 rounded-lg border border-gray-800 hover:border-[#e61717]/70 hover:shadow-lg hover:shadow-[#e61717]/10 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-100">
                        {earning.jobTitle}
                      </p>
                      <p className="text-xs text-gray-400">{earning.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          earning.status === "Completed"
                            ? "text-green-400" // 'completed' from backend is capitalized here
                            : "text-yellow-400"
                        }`}
                      >
                        ₹{earning.amount}
                      </p>
                      <p className="text-xs text-gray-500">{earning.status}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Total */}
            <div className="mt-5 border-t border-gray-700 pt-3 flex justify-between">
              <p className="text-gray-300 font-medium">Total Earned:</p>
              <p className="text-[#e61717] font-semibold">
                ₹
                {earnings.reduce(
                  (acc, e) => (e.status === "Completed" ? acc + e.amount : acc),
                  0
                )}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="mt-5 w-full bg-[#e61717] hover:bg-red-700 py-2 rounded-lg transition font-medium"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
