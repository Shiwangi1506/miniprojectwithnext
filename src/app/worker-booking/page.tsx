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
  BadgeCheck,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

interface Booking {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  service: string;
  date: string;
  price: number;
  slot: string;
  address: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed";
  createdAt: string;
}

const WorkerBookingsPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }

    if (sessionStatus === "authenticated") {
      const fetchBookings = async () => {
        setIsLoading(true);
        setError(null);

        try {
          const res = await fetch("/api/workers/bookings");
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch bookings.");
          }

          // Ensure that data.bookings is an array before setting state
          setBookings(Array.isArray(data.bookings) ? data.bookings : []);
        } catch (err) {
          // On any error, ensure bookings is an empty array
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

  const handleStatusChange = async (
    bookingId: string,
    newStatus: Booking["status"]
  ) => {
    setUpdatingStatus(bookingId);
    setError(null);

    try {
      const res = await fetch(`/api/workers/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update booking status.");
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? data.booking : booking
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while updating status."
      );
      // Optionally revert UI change on error, though current implementation just shows a general error.
    } finally {
      setUpdatingStatus(null);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {!bookings || bookings.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            You have no bookings yet.
          </p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#e61717] capitalize">
                      {booking.service}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Booking ID: {booking._id}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0">
                    <div className="flex items-center gap-1 mt-2 text-green-600">
                      <BadgeCheck size={16} />{" "}
                      <span className="text-xs font-semibold">
                        Paid Successfully
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-medium text-gray-600">
                        Status:
                      </span>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(
                            booking._id,
                            e.target.value as Booking["status"]
                          )
                        }
                        disabled={updatingStatus === booking._id}
                        className={`px-3 py-1 text-sm font-medium rounded-md border focus:outline-none focus:ring-2 focus:ring-[#e61717] transition-colors ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : "bg-green-100 text-green-800 border-green-300"
                        } ${
                          updatingStatus === booking._id
                            ? "cursor-not-allowed opacity-70"
                            : ""
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                      </select>
                      {updatingStatus === booking._id && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-green-600">
                      <span className="text-xs font-semibold">
                        {/* Paid Successfully - This seems duplicated, you might want to remove one */}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-500" />
                    <strong>Client:</strong> {booking.userId.username} (
                    {booking.userId.email})
                  </div>

                  <div className="flex items-center gap-3 font-semibold text-lg text-gray-800">
                    <strong>Amount:</strong>
                    <span>₹{booking.price}</span>
                  </div>

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

export default WorkerBookingsPage;
