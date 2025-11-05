"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Edit3,
  CalendarDays,
  ClipboardList,
  X,
} from "lucide-react";

// Sample Data
const mockBookings = [
  { id: 1, service: "AC Repair", date: "2025-11-05", status: "Active" },
  { id: 2, service: "House Cleaning", date: "2025-11-03", status: "Completed" },
  { id: 3, service: "Plumbing", date: "2025-11-02", status: "Completed" },
];

export default function UserDashboard() {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121212] text-white flex flex-col p-6 border-r border-gray-800">
        <h2 className="text-2xl font-semibold mb-8">User Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <SidebarButton icon={<CalendarDays size={18} />} text="Dashboard" />
          <SidebarButton
            icon={<ClipboardList size={18} />}
            text="My Bookings"
          />
          <SidebarButton icon={<User size={18} />} text="Profile" />
          <SidebarButton icon={<Edit3 size={18} />} text="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            Welcome Back, <span className="text-red-600">John</span>
          </h1>
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
          >
            Edit Profile
          </button>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <ProfileCard />
          <StatsCard title="Active Bookings" value={1} />
          <StatsCard title="Completed Bookings" value={2} />
        </div>

        {/* Booking History Table */}
        <div className="bg-white shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Bookings</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">Service</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200">
                  <td className="py-2">{booking.service}</td>
                  <td className="py-2">{booking.date}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        booking.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Profile Modal */}
        {isEditOpen && (
          <UserProfileEditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
          />
        )}
      </main>
    </div>
  );
}

// Sidebar Button Component
function SidebarButton({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 rounded transition text-sm">
      {icon}
      {text}
    </button>
  );
}

// Profile Card
function ProfileCard() {
  return (
    <div className="bg-white p-4 shadow-md flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
        JD
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">John Doe</p>
        <p className="text-gray-500 text-xs">Professional User</p>
        <div className="mt-1 text-gray-600 text-xs flex flex-col gap-0.5">
          <p>Email: johndoe@email.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Location: Lucknow</p>
        </div>
      </div>
    </div>
  );
}

// Stats Card
function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 shadow-md text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="font-semibold text-gray-900 text-lg">{value}</p>
    </div>
  );
}

// User Profile Edit Modal
function UserProfileEditModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+91 9876543210",
    location: "Lucknow, India",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white p-6 w-[90%] max-w-md shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {["name", "email", "phone", "location"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-600 text-xs mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          ))}

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
