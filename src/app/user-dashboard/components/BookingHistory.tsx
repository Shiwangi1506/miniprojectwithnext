"use client";

import React from "react";
import { motion } from "framer-motion";

const history = [
  { id: 1, service: "Carpenter", date: "2025-10-25", status: "Completed" },
  { id: 2, service: "Maid Service", date: "2025-10-20", status: "Cancelled" },
];

export default function BookingHistory() {
  return (
    <motion.div
      className="bg-[#121212] p-5 rounded-2xl shadow-md border border-gray-700"
      initial={{ borderColor: "#333" }}
      animate={{ borderColor: ["#333", "#e61717", "#3baaff", "#333"] }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Booking History</h2>
      {history.length > 0 ? (
        <ul className="space-y-3">
          {history.map((h) => (
            <motion.li
              key={h.id}
              className="bg-[#1E1E1E] p-3 rounded-lg shadow flex justify-between items-center border border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <p className="font-medium text-white">{h.service}</p>
                <p className="text-sm text-gray-400">{h.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  h.status === "Completed"
                    ? "bg-green-900/40 text-green-400"
                    : "bg-red-900/40 text-red-400"
                }`}
              >
                {h.status}
              </span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No previous bookings.</p>
      )}
    </motion.div>
  );
}
