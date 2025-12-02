"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Wallet, UserCog, Settings, Loader2 } from "lucide-react";

import Sidebar from "./components/Sidebar";
import StatusToggle from "./components/StatusToggle";
import PieChart from "./components/LivePieChart";
import FeedbackList from "./components/FeedbackList";
import ViewTodaysJobsModal from "./components/viewJob";
import CheckEarningsModal from "./components/checkEarnings";
import EditProfileModal from "./components/editProfile";
import ManageServicesModal from "./components/manageServices";
import { mockFeedback } from "./data/mockData";

// Define types for our fetched data
interface WorkerDetails {
  name: string;
  email: string;
  avatar?: string;
}

interface DashboardStats {
  pending: number;
  confirmed: number;
  completed: number;
  totalEarnings: number;
}

interface Feedback {
  name: string;
  comment: string;
}

interface DashboardData {
  worker: WorkerDetails;
  stats: DashboardStats;
  recentFeedback: Feedback[];
}

// ✅ Main Worker Dashboard Component
export default function WorkerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Declare all hooks first (always)
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Define fetchDashboardData outside useEffect, wrapped in useCallback
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true); // Set loading true when refetching
    setError(null);
    try {
      const res = await fetch("/api/workers/dashboard");
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch dashboard data.");
      }

      setDashboardData(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once

  // ✅ Protect route (check session and role)
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.user.role !== "worker") {
      router.replace("/user-dashboard");
      return;
    }

    fetchDashboardData();
  }, [session, status, router, fetchDashboardData]);

  // ✅ Loading and error states
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-[#e61717]" />
        <p className="ml-4 text-lg font-medium text-gray-700">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div
      className="flex min-h-screen bg-[#f9f9f9] text-black"
      style={{ backgroundImage: "url('/image/login.jpg')" }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <main className="flex-1 p-6 md:p-10 bg-white/70 backdrop-blur-xl shadow-inner border-l border-white/40">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            👋 Welcome back,{" "}
            <span className="text-[#e61717]">
              {dashboardData?.worker.name || session?.user?.name || "Worker"}
            </span>
          </h1>
          <StatusToggle />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <ActionButton
            icon={<CalendarDays size={30} className="text-[#e61717]" />}
            text="View Today's Jobs"
            onClick={() => setIsJobsOpen(true)}
          />
          <ActionButton
            icon={<Wallet size={30} className="text-[#e61717]" />}
            text="Check Earnings"
            onClick={() => setIsEarningsOpen(true)}
          />
          <ActionButton
            icon={<UserCog size={30} className="text-[#e61717]" />}
            text="Edit Profile"
            onClick={() => setIsEditOpen(true)}
          />
          <ActionButton
            icon={<Settings size={30} className="text-[#e61717]" />}
            text="Manage Services"
            onClick={() => setIsManageOpen(true)}
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Earnings Overview */}
          <motion.div
            className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/60 shadow-md hover:shadow-xl transition"
            initial={{ borderColor: "#e61717" }}
            animate={{
              borderColor: ["#e61717", "#333", "#e61717"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Earnings Overview
            </h2>
            <PieChart />

            <button className="mt-6 w-full bg-[#e61717] text-white py-2 rounded-lg font-semibold hover:bg-[#c51414] transition">
              Withdraw Earnings
            </button>
          </motion.div>

          {/* Recent Feedback */}
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/60 shadow-md hover:shadow-xl transition">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Recent Feedback
            </h2>
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
          onProfileUpdate={fetchDashboardData} // Pass the refresh function
        />
        <ManageServicesModal
          isOpen={isManageOpen}
          onClose={() => setIsManageOpen(false)}
        />
      </main>
    </div>
  );
}

// ✅ Reusable Quick Action Button Component
function ActionButton({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className="bg-white/60 hover:bg-white/80 backdrop-blur-lg border border-white/60 hover:border-[#e61717] rounded-2xl p-5 text-center shadow-md hover:shadow-lg transition flex flex-col items-center justify-center"
    >
      <div className="mb-2">{icon}</div>
      <p className="font-semibold text-gray-900">{text}</p>
    </motion.button>
  );
}
