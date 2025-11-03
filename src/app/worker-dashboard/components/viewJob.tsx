"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Job {
  id: number;
  service: string;
  customer: string;
  time: string;
  location: string;
  status: "Pending" | "Completed" | "Ongoing";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const mockJobs: Job[] = [
  {
    id: 1,
    service: "AC Repair",
    customer: "Rohit Sharma",
    time: "10:30 AM",
    location: "Gomti Nagar, Lucknow",
    status: "Ongoing",
  },
  {
    id: 2,
    service: "Plumber Service",
    customer: "Neha Verma",
    time: "1:00 PM",
    location: "Aliganj, Lucknow",
    status: "Pending",
  },
  {
    id: 3,
    service: "Electrician Visit",
    customer: "Amit Singh",
    time: "4:00 PM",
    location: "Hazratganj, Lucknow",
    status: "Pending",
  },
];

export default function ViewTodaysJobsModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#121212] border border-gray-700 rounded-2xl shadow-xl p-6 w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                📅 Today's Jobs
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Job List */}
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#1a1a1a] border border-gray-700 p-4 rounded-xl flex justify-between items-center hover:border-red-600 transition"
                >
                  <div>
                    <p className="font-medium text-white">{job.service}</p>
                    <p className="text-sm text-gray-400">
                      {job.customer} • {job.time}
                    </p>
                    <p className="text-xs text-gray-500">{job.location}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === "Completed"
                        ? "bg-green-700/20 text-green-400"
                        : job.status === "Ongoing"
                        ? "bg-blue-700/20 text-blue-400"
                        : "bg-yellow-700/20 text-yellow-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-right">
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
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
