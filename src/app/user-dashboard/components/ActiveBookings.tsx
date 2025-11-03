"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

interface Booking {
  _id: string;
  service: string;
  date: string;
  status: string;
}

export default function ActiveBookings() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/bookings?userId=${session.user.id}`);
        const data = await res.json();
        if (data.success) setBookings(data.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchBookings();
    else if (status === "unauthenticated") setLoading(false);
  }, [session, status]);

  if (loading) return <p>Loading bookings...</p>;
  if (status === "unauthenticated")
    return <p>Please log in to see your bookings.</p>;

  return (
    <motion.div
      className="bg-[#121212] p-5 rounded-2xl shadow-md border border-gray-700"
      initial={{ borderColor: "#333" }}
      animate={{ borderColor: ["#333", "#e61717", "#3baaff", "#333"] }}
      transition={{ duration: 5, repeat: Infinity }}
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Active Bookings</h2>
      {bookings.length > 0 ? (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <motion.li
              key={b._id}
              className="bg-[#1E1E1E] p-3 rounded-lg shadow flex justify-between items-center border border-gray-700"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <p className="font-medium text-white">{b.service}</p>
                <p className="text-sm text-gray-400">{b.date}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  b.status === "Confirmed"
                    ? "bg-green-900/40 text-green-400"
                    : "bg-yellow-900/40 text-yellow-400"
                }`}
              >
                {b.status}
              </span>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No active bookings.</p>
      )}
    </motion.div>
  );
}
