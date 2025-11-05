"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, X, Camera } from "lucide-react";

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
    gender: "Male",
    dob: "1995-06-12",
    city: "Bangalore",
    address: "123, Indiranagar, Bangalore",
    profession: "AC Technician",
    experience: "2 years",
    bio: "Dedicated technician with hands-on experience in home repair and maintenance.",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Profile updated successfully!");
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="bg-[#121212] text-white border border-gray-700 rounded-2xl w-[92%] max-w-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User size={24} className="text-[#e61717]" />
            <h2 className="text-xl font-semibold text-white">Edit Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                profileImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#e61717]/60 shadow-md"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[#e61717] p-2 rounded-full border-2 border-[#121212] hover:bg-red-700 transition"
            >
              <Camera size={16} />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="text-sm text-gray-400 mt-2">
            Click camera to update photo
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Profession
            </label>
            <input
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Experience
            </label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 resize-none
                         focus:border-[#e61717] focus:ring-1 focus:ring-[#e61717] outline-none transition"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#e61717] rounded-lg hover:bg-red-700 transition font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
