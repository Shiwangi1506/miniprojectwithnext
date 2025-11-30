"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Star,
  Briefcase,
  Award,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Worker } from "../types";

interface WorkerDetailsModalProps {
  worker: Worker | null;
  open: boolean;
  onClose: () => void;
  onBook: (worker: Worker) => void;
}

export const WorkerDetailsModal: React.FC<WorkerDetailsModalProps> = ({
  worker,
  open,
  onClose,
  onBook,
}) => {
  if (!worker) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[460px] bg-white shadow-2xl z-50 flex flex-col overflow-y-auto rounded-l-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            {/* Header with Profile Look */}
            <div className="relative bg-[#000000] text-white p-6 flex flex-col items-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow hover:bg-white"
              >
                <X size={20} className="text-gray-800" />
              </button>

              <img
                src={worker.avatar || "/default-avatar.jpg"}
                alt={worker.name}
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover mb-3"
              />

              <h2 className="text-xl font-semibold">{worker.name}</h2>

              <div className="flex items-center gap-2 mt-1">
                <Star size={16} className="text-yellow-400" />
                <span className="text-sm">
                  {worker.rating?.toFixed(1) || "4.5"} ({worker.reviews || 0}{" "}
                  reviews)
                </span>
              </div>

              {worker.verified && (
                <div className="flex items-center gap-1 text-green-300 text-sm mt-1">
                  <ShieldCheck size={15} /> Verified Professional
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 text-gray-700">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase size={18} className="text-[#e61717]" />
                <span>{worker.experience} years experience</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin size={18} className="text-[#e61717]" />
                <span>{worker.location?.city || "Not specified"}</span>
              </div>

              {worker.skills?.length > 0 && (
                <div>
                  <p className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                    <Award size={16} /> Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {worker.description && (
                <div>
                  <p className="font-semibold mb-2 text-gray-800 flex items-center gap-2">
                    <FileText size={16} /> Description
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {worker.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-gray-50 mt-auto">
              <button
                onClick={() => onBook(worker)}
                className="w-full py-3 bg-[#e61717] text-white font-semibold rounded-lg hover:bg-[#c91414] transition"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
