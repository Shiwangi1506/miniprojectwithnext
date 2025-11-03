"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function EditProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@urbansetgo.in",
    city: "Bangalore",
    experience: "2 years",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Profile updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="bg-[#121212] text-white border border-gray-700 rounded-2xl w-[90%] max-w-lg p-6 shadow-xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-red-500">
          ✏️ Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Experience
            </label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
