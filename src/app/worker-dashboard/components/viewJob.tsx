"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Wrench, Droplets, Zap } from "lucide-react"; // Added icons

interface Job {
  id: number;
  service: string;
  customer: string;
  time: string;
  location: string;
  status: "Pending" | "Completed" | "Ongoing";
  icon: React.ReactNode;
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
    icon: <Wrench size={20} className="text-[#e61717]" />,
  },
  {
    id: 2,
    service: "Plumber Service",
    customer: "Neha Verma",
    time: "1:00 PM",
    location: "Aliganj, Lucknow",
    status: "Pending",
    icon: <Droplets size={20} className="text-[#e61717]" />,
  },
  {
    id: 3,
    service: "Electrician Visit",
    customer: "Amit Singh",
    time: "4:00 PM",
    location: "Hazratganj, Lucknow",
    status: "Pending",
    icon: <Zap size={20} className="text-[#e61717]" />,
  },
];

export default function ViewTodaysJobsModal({ isOpen, onClose }: Props) {
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
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#181818] border border-gray-700 p-4 rounded-lg 
                             flex justify-between items-center hover:border-[#e61717]/70 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{job.icon}</div>
                    <div>
                      <p className="font-medium text-gray-100">{job.service}</p>
                      <p className="text-sm text-gray-400">
                        {job.customer} • {job.time}
                      </p>
                      <p className="text-xs text-gray-500">{job.location}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.status === "Completed"
                        ? "bg-green-600/20 text-green-400"
                        : job.status === "Ongoing"
                        ? "bg-blue-600/20 text-blue-400"
                        : "bg-yellow-600/20 text-yellow-400"
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
