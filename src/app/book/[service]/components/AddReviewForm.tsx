"use client";

import React, { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { Worker } from "../types";

interface AddReviewFormProps {
  worker: Worker;
  onReviewAdded: () => void; // Callback to refresh feedback list
}

export const AddReviewForm: React.FC<AddReviewFormProps> = ({
  worker,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      setError("Please provide a rating and a comment.");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId: worker._id, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit review.");
      }

      // Reset form and trigger refresh
      setRating(0);
      setComment("");
      onReviewAdded();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border-t">
      <h3 className="font-semibold text-gray-800 mb-3">Leave a Review</h3>
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            className={`cursor-pointer transition-colors ${
              star <= (hoverRating || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={`Share your experience with ${worker.name}...`}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e61717] resize-none"
        rows={3}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-3 py-2.5 bg-black text-white font-semibold rounded-lg hover:bg-[#e61717] transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        Submit Review
      </button>
    </form>
  );
};
