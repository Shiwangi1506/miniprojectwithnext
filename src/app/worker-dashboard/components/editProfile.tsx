"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  User,
  Mail,
  Phone,
  Image as ImageIcon,
  MapPin,
  Briefcase,
  BookText,
} from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: () => void; // Callback to refresh dashboard data
}

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  profession?: string;
  bio?: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onProfileUpdate,
}: EditProfileModalProps) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    address: "",
    profession: "",
    bio: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/workers/profile");
          const result = await res.json();
          if (!res.ok) throw new Error(result.message);

          const fetchedData = result.data || {};
          // Map the first skill from the backend 'skills' array to the frontend 'profession' field
          const profession =
            Array.isArray(fetchedData.skills) && fetchedData.skills.length > 0
              ? fetchedData.skills[0]
              : "";
          // Map the city from the backend 'location.city' to the frontend 'address' field
          const address = fetchedData.location?.city || "";

          setProfile({ ...fetchedData, profession, address });
          setImagePreview(result.data?.avatar || null);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load profile."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a temporary URL for instant preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();

      // Append all text data
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone || "");
      formData.append("address", profile.address || "");
      formData.append("profession", profile.profession || "");
      formData.append("bio", profile.bio || "");
      formData.append("avatar", profile.avatar || ""); // Send existing avatar URL

      // Append the new file only if it exists
      if (imageFile) {
        formData.append("file", imageFile);
      }

      // Send all data in a single request to the profile endpoint
      const res = await fetch("/api/workers/profile", {
        method: "PATCH",
        body: formData, // The body is now FormData, not JSON
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      onProfileUpdate(); // Trigger data refresh on the dashboard
      onClose(); // Close the modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            {isLoading ? (
              <div className="h-64 flex justify-center items-center">
                <Loader2 className="animate-spin text-[#e61717]" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                {error && (
                  <p className="text-red-500 text-sm bg-red-100 p-3 rounded-md">
                    {error}
                  </p>
                )}
                {/* Image Upload Section */}
                <div className="flex flex-col items-center mb-6">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <img
                      src={imagePreview || "/image/default-avatar.png"}
                      alt="Profile Preview"
                      className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 hover:border-[#e61717] transition-all"
                    />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Click image to change
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e61717]"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e61717]"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      placeholder="Phone Number (Optional)"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e61717]"
                    />
                  </div>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="address"
                      value={profile.address || ""}
                      onChange={handleChange}
                      placeholder="Your Address"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e61717]"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="profession"
                      value={profile.profession || ""}
                      onChange={handleChange}
                      placeholder="Your Profession (e.g., Plumber)"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e61717]"
                    />
                  </div>
                  <div className="relative">
                    <BookText
                      className="absolute left-3 top-4 text-gray-400"
                      size={20}
                    />
                    <textarea
                      name="bio"
                      value={profile.bio || ""}
                      onChange={handleChange}
                      placeholder="A short bio about your skills and experience..."
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e61717] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-[#e61717] text-white font-medium hover:bg-[#c51414] transition-colors flex items-center justify-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
