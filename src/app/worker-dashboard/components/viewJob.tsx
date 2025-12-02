"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Wrench, Droplets, Zap, Loader2 } from "lucide-react"; // Added icons

interface BookingData {
  _id: string;
  serviceType: string;
  userId: {
    username: string;
    email: string;
  };
  date: string; // Assuming date is a string like "YYYY-MM-DD" or ISO string
  time: string;
  location: string;
  status: "pending" | "completed" | "cancelled" | "ongoing";
  price: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewTodaysJobsModal({ isOpen, onClose }: Props) {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/workers/bookings");
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.message || "Failed to fetch bookings.");
          }

          const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
          const todaysBookings = result.bookings.filter(
            (booking: BookingData) => booking.date.startsWith(today)
          );
          setBookings(todaysBookings);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred."
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookings();
    }
  }, [isOpen]);

  const getServiceIcon = (serviceType: string) => {
    // Add a guard clause to handle undefined or null serviceType
    if (!serviceType) {
      return <Wrench size={20} className="text-[#e61717]" />; // Return a default icon
    }
    switch (serviceType.toLowerCase()) {
      case "ac repair":
        return <Wrench size={20} className="text-[#e61717]" />;
      case "plumber service":
        return <Droplets size={20} className="text-[#e61717]" />;
      case "electrician visit":
        return <Zap size={20} className="text-[#e61717]" />;
      // Add more cases for other service types as needed
      default:
        return <Wrench size={20} className="text-[#e61717]" />; // Default icon
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl p-6 w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <CalendarDays size={22} className="text-[#e61717]" />
                <h2 className="text-xl font-semibold text-white">
                  Today's Jobs
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Job List */}
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-[#e61717]" />
              </div>
            ) : error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-400 text-center">
                No jobs scheduled for today.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-[#181818] border border-gray-700 p-4 rounded-lg 
                               flex justify-between items-center hover:border-[#e61717]/70 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getServiceIcon(booking.serviceType)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-100">
                          {booking.serviceType}
                        </p>
                        <p className="text-sm text-gray-400">
                          {booking.userId.username} • {booking.time}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.location}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "completed"
                          ? "bg-green-600/20 text-green-400"
                          : booking.status === "ongoing"
                          ? "bg-blue-600/20 text-blue-400"
                          : booking.status === "pending"
                          ? "bg-yellow-600/20 text-yellow-400"
                          : "bg-gray-600/20 text-gray-400" // For 'cancelled' or other statuses
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 text-right">
              <button
                onClick={onClose}
                className="bg-[#e61717] hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
