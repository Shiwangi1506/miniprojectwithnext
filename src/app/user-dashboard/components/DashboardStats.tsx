"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DashboardStats() {
  const stats = [
    { label: "Total Bookings", value: 12 },
    { label: "Completed", value: 8 },
    { label: "Pending", value: 3 },
    { label: "Cancelled", value: 1 },
  ];

  return (
    <motion.div
      className="bg-[#121212] p-5 rounded-2xl shadow-md border border-gray-700"
      initial={{ borderColor: "#333" }}
      animate={{ borderColor: ["#333", "#e61717", "#3baaff", "#333"] }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      <h2 className="text-xl font-semibold mb-4 text-white">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, index) => (
          <motion.div
            key={index}
            className="p-4 bg-[#1E1E1E] rounded-xl shadow border border-gray-700 text-center hover:shadow-lg transition"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-lg font-bold text-[#e61717]">{s.value}</h3>
            <p className="text-sm text-gray-300">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
