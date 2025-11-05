"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Edit3, X } from "lucide-react";

export default function UserInfoCard() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "johndoe@email.com",
    phone: "+91 9876543210",
    location: "Lucknow, India",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Profile updated successfully!");
    setIsEditOpen(false);
  };

  return (
    <motion.div
      className="relative bg-gray-900/90 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-lg overflow-hidden border border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
          Profile
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
        >
          <Edit3 size={16} /> Edit
        </motion.button>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-red-600 to-pink-500 p-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white text-xl md:text-2xl font-bold">
              JD
            </div>
          </div>
        </div>
        <div>
          <p className="text-white text-lg md:text-xl font-semibold">
            {formData.fullName}
          </p>
          <p className="text-gray-400 text-sm md:text-base">
            Professional User
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
        <InfoRow
          icon={<Mail size={16} className="text-red-500" />}
          label="Email"
          value={formData.email}
        />
        <InfoRow
          icon={<Phone size={16} className="text-red-500" />}
          label="Phone"
          value={formData.phone}
        />
        <InfoRow
          icon={<MapPin size={16} className="text-red-500" />}
          label="Location"
          value={formData.location}
        />
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <motion.div
            className="bg-gray-900 rounded-2xl w-[90%] max-w-md p-6 shadow-xl border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <InputField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <InputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 text-white transition"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// Reusable Info Row Component
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm md:text-base">
      {icon}
      <p className="truncate">
        <strong className="text-white">{label}:</strong> {value}
      </p>
    </div>
  );
}

// Reusable Input Field Component
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-400 text-sm mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-red-500 outline-none transition"
      />
    </div>
  );
}
