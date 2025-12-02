"use client";

import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Feedback {
  name?: string;
  comment: string;
  role?: string; // optional role or user type (e.g. "Customer", "Technician")
  userName?: string; // Making userName optional to match mockData
}

interface FeedbackListProps {
  feedback?: Feedback[];
}

export default function FeedbackList({
  feedback: initialFeedback,
}: FeedbackListProps) {
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialFeedback);

  useEffect(() => {
    // If initial feedback was supplied via props, do not fetch again
    if (initialFeedback) return;

    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/workers/feedback");
        if (!res.ok) throw new Error("Failed to fetch feedback");
        const data = await res.json();
        setFeedback(data.feedback || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, [initialFeedback]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-[#e61717]" size={32} />
      </div>
    );
  }

  if (!feedback || feedback.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No feedback available yet.</p>
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
            <p className="text-sm font-semibold text-gray-900">
              {f.userName || f.name}
            </p>
            {f.role && <p className="text-xs text-gray-500">{f.role}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
