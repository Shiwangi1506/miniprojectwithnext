"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Loader2 } from "lucide-react";

interface Feedback {
  name: string;
  comment: string;
  role?: string; // optional role or user type (e.g. "Customer", "Technician")
  userName: string;
}

export default function FeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // This API route needs to be created to fetch feedback for the logged-in worker
        const res = await fetch("/api/workers/feedback");
        if (!res.ok) throw new Error("Failed to fetch feedback");
        const data = await res.json();
        setFeedback(data.feedback || []); // Ensure feedback is always an array
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-[#e61717]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          viewport={{ once: true }}
          className="relative p-6 bg-gradient-to-br from-white via-white/90 to-gray-50 
                     border border-gray-200 shadow-lg hover:shadow-xl 
                     hover:border-[#e61717]/60 transition-all duration-500 rounded-xl"
        >
          {/* Quote Icon */}
          <div className="absolute -top-3 -left-3 bg-[#e61717] text-white p-2 rounded-full shadow-md">
            <FaQuoteLeft size={14} />
          </div>

          {/* Feedback Text */}
          <p className="text-[0.95rem] text-gray-700 leading-relaxed italic">
            “{f.comment}”
          </p>

          {/* Author Info */}
          <div className="mt-4 text-right">
            <p className="text-sm font-semibold text-gray-900">{f.userName}</p>
            {f.role && <p className="text-xs text-gray-500">{f.role}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
