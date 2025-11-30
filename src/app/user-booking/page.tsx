"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Tag,
  Loader2,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";
import Image from "next/image";

interface Booking {
  _id: string;
  workerId: {
    _id: string;
    name: string;
    avatar: string;
    skills: string[];
  };
  service: string;
  date: string;
  price: number;
  slot: string;
  address: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed";
}

const UserBookingsPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }

    if (sessionStatus === "authenticated") {
      const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/user/bookings");
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch your bookings.");
          }

          setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        } catch (err) {
          setBookings([]);
          setError(
            err instanceof Error ? err.message : "An unknown error occurred."
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchBookings();
    }
  }, [sessionStatus, router]);

  if (isLoading || sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#e61717]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-600">
          An Error Occurred
        </h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Booking History
        </h1>
        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            You haven't booked any services yet.
          </p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={booking.workerId.avatar || "/default-avatar.png"}
                      alt={booking.workerId.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover w-16 h-16"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-[#e61717] capitalize">
                        {booking.service}
                      </h2>
                      <p className="text-sm text-gray-600">
                        with{" "}
                        <span className="font-medium">
                          {booking.workerId.name}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={`mt-3 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-500" />{" "}
                    <strong>Date:</strong>{" "}
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-500" />{" "}
                    <strong>Slot:</strong> {booking.slot}
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-500" />{" "}
                    <strong>Address:</strong> {booking.address}
                  </div>
                  <div className="flex items-center gap-3 font-semibold text-lg text-gray-800">
                    <BadgeCheck size={16} className="text-green-500" />{" "}
                    <strong>Amount Paid:</strong> ₹{booking.price}
                  </div>
                  {booking.notes && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <Tag size={16} className="text-gray-500 mt-1" />{" "}
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookingsPage;
