"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function StatusToggle() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600 font-medium text-xs">Work Status:</span>
      <motion.button
        onClick={() => setIsActive(!isActive)}
        className={`relative w-12 h-6 flex items-center px-1 rounded-full cursor-pointer transition-colors ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="bg-white w-5 h-5 rounded-full shadow flex items-center justify-center"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            x: isActive ? 24 : 0,
          }}
        >
          {isActive ? (
            <CheckCircle size={14} className="text-green-500" />
          ) : (
            <XCircle size={14} className="text-gray-500" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
