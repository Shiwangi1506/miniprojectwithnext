"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Trash2,
  Settings,
  Loader2,
  Tag,
  DollarSign,
} from "lucide-react";

export default function ManageSkillsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [skills, setSkills] = useState<string[]>([]);
  const [price, setPrice] = useState<number | string>("");
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchServices = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/workers/services");
          const result = await res.json();
          if (!res.ok) throw new Error(result.message);
          setSkills(result.data.skills || []);
          setPrice(result.data.price || "");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load skills."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchServices();
    }
  }, [isOpen]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/workers/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, price: Number(price) }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      onClose(); // Close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="bg-[#121212] text-white border border-gray-700 rounded-2xl w-[90%] max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Settings size={24} className="text-red-500" />
                <h2 className="text-2xl font-semibold text-white">
                  Manage Skills & Price
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={24} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="animate-spin text-red-500" />
              </div>
            ) : (
              <>
                {/* Base Price Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Base Price (per hour/visit)
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <input
                      type="number"
                      placeholder="e.g., 500"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-transparent border border-gray-600 rounded-lg pl-10 pr-3 py-2 focus:border-red-500 outline-none text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Skills Management */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Your Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {skills.length === 0 && (
                      <p className="text-gray-500 text-sm">No skills added.</p>
                    )}
                    {skills.map((skill) => (
                      <motion.div
                        key={skill}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-gray-700 rounded-full px-4 py-1.5 text-sm"
                      >
                        <Tag size={14} className="text-red-400" />
                        <span>{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end items-center mt-6 gap-4">
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                onClick={handleSaveChanges}
                className="bg-green-600 hover:bg-green-700 rounded-lg px-5 py-2 transition font-medium flex items-center gap-2"
                disabled={isSaving || isLoading}
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
