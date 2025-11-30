"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  MapPin,
  Edit3,
  CalendarDays,
  ClipboardList,
  X,
} from "lucide-react";

export default function UserDashboard() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null); // State for full user profile
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ Protect route
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) router.push("/login");
    else if (session.user.role === "worker") router.push("/worker-dashboard");
  }, [status, session, router]);

  // ✅ Fetch full user profile from our API
  useEffect(() => {
    async function fetchUserProfile() {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/user?email=${session.user.email}`);
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    }

    fetchUserProfile();
  }, [session]);

  // ✅ Fetch bookings safely
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        // Ensure we store an array (fallback if API sends object)
        if (Array.isArray(data)) {
          setBookings(data);
        } else if (data.bookings && Array.isArray(data.bookings)) {
          setBookings(data.bookings);
        } else {
          console.warn("Unexpected bookings format:", data);
          setBookings([]);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setBookings([]);
      }
    }
    fetchBookings();
  }, []);

  if (status === "loading" || !session?.user || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading your dashboard...
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status === "Active");
  const completedBookings = bookings.filter((b) => b.status === "Completed");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#121212] text-white flex flex-col p-6 border-r border-gray-800">
        <h2 className="text-2xl font-semibold mb-8">User Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <SidebarButton
            icon={<CalendarDays size={18} />}
            text="Dashboard"
            href="/user-dashboard"
          />
          <SidebarButton
            icon={<ClipboardList size={18} />}
            text="My Bookings"
            href="/user-booking"
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
            Welcome Back,{" "}
            <span className="text-red-600">
              {userProfile.username || "User"}
            </span>
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
          <ProfileCard user={userProfile} />
          <StatsCard title="Active Bookings" value={activeBookings.length} />
          <StatsCard
            title="Completed Bookings"
            value={completedBookings.length}
          />
        </div>

        {/* Booking History Table */}
        <div className="bg-white shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Bookings</h2>
          {bookings.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2">Service</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={index} className="border-b border-gray-200">
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
          ) : (
            <p className="text-gray-500 text-sm">No bookings found.</p>
          )}
        </div>

        {/* Edit Profile Modal */}
        {isEditOpen && (
          <UserProfileEditModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            user={userProfile}
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
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700 rounded-md transition text-sm cursor-pointer">
      {icon}
      {text}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <button className="w-full text-left">{content}</button>;
}

// Profile Card
function ProfileCard({ user }: { user: any }) {
  return (
    <div className="bg-white p-4 shadow-md flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
        {user.username?.substring(0, 2).toUpperCase() || "U"}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{user.username}</p>
        <p className="text-gray-500 text-xs capitalize">{user.role}</p>
        <div className="mt-1 text-gray-600 text-xs flex flex-col gap-0.5">
          <p>Email: {user.email}</p>
          <p>Location: {user.location?.city || "Not set"}</p>
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
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}) {
  const [formData, setFormData] = useState({
    username: user.username || user.name || "",
    email: user.email || "",
    location: user.location?.city || "Lucknow, India",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Profile updated successfully!");
      onClose();
    } else {
      alert("Update failed!");
    }
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
          {/* Username Field */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-xs mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Location Field */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-xs mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          {/* Display Email (read-only) */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-xs mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

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
