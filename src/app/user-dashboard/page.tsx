"use client";

import React from "react";
import { motion } from "framer-motion";
import UserInfoCard from "./components/UserInfoCard";
import ActiveBookings from "./components/ActiveBookings";
import BookingHistory from "./components/BookingHistory";
import DashboardStats from "./components/DashboardStats";

export default function UserDashboard() {
  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white">
      {/* Sidebar (optional for future) */}
      <aside className="hidden md:flex flex-col bg-[#121212] border-r border-gray-700 w-64 p-6">
        <h2 className="text-2xl font-semibold mb-8">User Dashboard</h2>
        <nav className="space-y-4">
          <button className="w-full text-left text-gray-300 hover:text-white">
            Dashboard
          </button>
          <button className="w-full text-left text-gray-300 hover:text-white">
            My Bookings
          </button>
          <button className="w-full text-left text-gray-300 hover:text-white">
            Profile
          </button>
          <button className="w-full text-left text-gray-300 hover:text-white">
            Settings
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">👋 Welcome Back!</h1>
          <div className="flex items-center gap-3">
          </div>
        </div>

        {/* Top Section - User Info & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            className="bg-[#121212] rounded-2xl p-6 border border-gray-700 shadow-md"
            initial={{ borderColor: "#333" }}
            animate={{ borderColor: ["#333", "#ff3b3b", "#3baaff", "#333"] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <UserInfoCard />
          </motion.div>

          <div className="md:col-span-2 bg-[#121212] rounded-2xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-lg mb-4 font-semibold">Your Stats</h2>
            <DashboardStats />
          </div>
        </div>

        {/* Bottom Section - Active Bookings & History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-[#121212] rounded-2xl p-6 border border-gray-700 shadow-md"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-lg mb-4 font-semibold">Active Bookings</h2>
            <ActiveBookings />
          </motion.div>

          <div className="bg-[#121212] rounded-2xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-lg mb-4 font-semibold">Booking History</h2>
            <BookingHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
