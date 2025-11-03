"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Edit3 } from "lucide-react";

export default function UserInfoCard() {
  return (
    <motion.div
      className="relative bg-gradient-to-br from-[#151515] to-[#0e0e0e]/90 backdrop-blur-md p-6 rounded-2xl border border-gray-700/60 shadow-lg hover:shadow-red-600/20 transition-all duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white tracking-wide">
          User Profile
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-[#e61717] hover:bg-[#000000] text-white font-medium transition"
        >
          <Edit3 size={16} />
          Edit
        </motion.button>
      </div>

      {/* Profile Info */}
      <div className="space-y-3 text-gray-300">
        <div className="flex items-center gap-2">
          <User size={18} className="text-[#e61717]" />
          <p>
            <strong className="text-white">Name:</strong> John Doe
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Mail size={18} className="text-[#e61717]" />
          <p>
            <strong className="text-white">Email:</strong> johndoe@email.com
          </p>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-[#e61717]" />
          <p>
            <strong className="text-white">Location:</strong> Lucknow
          </p>
        </div>
      </div>

      {/* Decorative Animated Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-transparent"
        animate={{
          boxShadow: ["0 0 0px #e61717", "0 0 15px #e61717", "0 0 0px #e61717"],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}
