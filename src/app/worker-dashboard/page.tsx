"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardCard from "./components/DashboardCard";
import PieChart from "./components/LivePieChart";
import FeedbackList from "./components/FeedbackList";
import ViewTodaysJobsModal from "./components/viewJob";
import CheckEarningsModal from "./components/checkEarnings";
import EditProfileModal from "./components/editProfile";
import ManageServicesModal from "./components/manageServices";
import { mockFeedback } from "./data/mockData";
import { motion } from "framer-motion";

export default function WorkerDashboard() {
  // ✅ modal states
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">👋 Hello, Rahul!</h1>
          <div className="flex items-center gap-3">
            <button className="bg-blue-500 px-3 py-1 rounded-lg text-sm">
              Available
            </button>
            <button className="bg-gray-700 px-3 py-1 rounded-lg text-sm">
              Busy
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* View Today’s Jobs */}
          <button
            onClick={() => setIsJobsOpen(true)}
            className="bg-[#121212] border border-gray-700 hover:border-red-600 rounded-xl p-4 text-center transition"
          >
            <div className="text-3xl mb-2">📅</div>
            <p className="font-medium text-white">View Today's Jobs</p>
          </button>

          {/* Check Earnings */}
          <button
            onClick={() => setIsEarningsOpen(true)}
            className="bg-[#121212] border border-gray-700 hover:border-red-600 rounded-xl p-4 text-center transition"
          >
            <div className="text-3xl mb-2">💰</div>
            <p className="font-medium text-white">Check Earnings</p>
          </button>

          {/* Edit Profile */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="bg-[#121212] border border-gray-700 hover:border-red-600 rounded-xl p-4 text-center transition"
          >
            <div className="text-3xl mb-2">✏️</div>
            <p className="font-medium text-white">Edit Profile</p>
          </button>

          {/* Manage Services */}
          <button
            onClick={() => setIsManageOpen(true)}
            className="bg-[#121212] border border-gray-700 hover:border-red-600 rounded-xl p-4 text-center transition"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <p className="font-medium text-white">Manage Services</p>
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-[#121212] rounded-2xl p-6 border border-gray-700 shadow-md"
            initial={{ borderColor: "#333" }}
            animate={{ borderColor: ["#333", "#ff3b3b", "#3baaff", "#333"] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <h2 className="text-lg mb-4">Earnings</h2>
            <PieChart />

            <button className="bg-red-500 mt-4 px-4 py-2 rounded-lg hover:bg-red-600 transition">
              Withdraw Earnings
            </button>
          </motion.div>

          <div className="bg-[#121212] rounded-2xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-lg mb-4">Recent Feedback</h2>
            <FeedbackList feedback={mockFeedback} />
          </div>
        </div>

        {/* ✅ Popup Modals */}
        <ViewTodaysJobsModal
          isOpen={isJobsOpen}
          onClose={() => setIsJobsOpen(false)}
        />

        <CheckEarningsModal
          isOpen={isEarningsOpen}
          onClose={() => setIsEarningsOpen(false)}
        />

        <EditProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />

        <ManageServicesModal
          isOpen={isManageOpen}
          onClose={() => setIsManageOpen(false)}
        />
      </main>
    </div>
  );
}
