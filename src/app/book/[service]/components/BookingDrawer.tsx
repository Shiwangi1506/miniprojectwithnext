"use client";
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Worker } from "../types";
import { FaStar } from "react-icons/fa";

interface BookingDrawerProps {
  worker: Worker | null;
  drawerOpen: boolean;
  setDrawerOpen: (val: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  selectedSlot: string | null;
  setSelectedSlot: (s: string | null) => void;
  address: string;
  setAddress: (s: string) => void;
  notes: string;
  setNotes: (s: string) => void;
  confirmBooking: () => void;
  timeSlots: string[];
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
  worker,
  drawerOpen,
  setDrawerOpen,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  address,
  setAddress,
  notes,
  setNotes,
  confirmBooking,
  timeSlots,
}) => {
  if (!worker) return null;

  const nextDays = useMemo(() => {
    const arr: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const currency = (n: number) => `₹${n}`;

  return (
    <AnimatePresence>
      {drawerOpen && worker && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] z-50 bg-white shadow-2xl overflow-auto"
          >
            <div className="p-6">
              {/* Worker Info */}
              <div className="flex items-center gap-3">
                <img
                  src={worker.avatar ?? "/placeholder-avatar.png"}
                  alt={worker.name}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <div className="text-lg font-semibold">{worker.name}</div>
                  <div className="text-sm text-gray-600 truncate">
                    {[worker.address, worker.location?.city]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}{" "}
                    • {worker.experience} yrs
                  </div>
                  <div className="text-sm text-yellow-500 mt-1 flex items-center gap-2">
                    <FaStar />
                    <span className="text-gray-700">{worker.rating}</span>
                  </div>
                </div>
              </div>

              {/* Date selection */}
              <div className="mt-5">
                <div className="text-sm text-gray-700 font-medium mb-2">
                  Choose Date
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {nextDays.slice(0, 7).map((d) => {
                    const iso = d.toISOString().split("T")[0];
                    const isSelected =
                      selectedDate &&
                      selectedDate.toDateString() === d.toDateString();
                    return (
                      <button
                        key={iso}
                        onClick={() => setSelectedDate(d)}
                        className={`py-2 px-2 text-xs rounded-md ${
                          isSelected
                            ? "bg-[#e61717] text-white"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">
                          {d.toLocaleDateString("en-IN", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-xs">{d.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots */}
              <div className="mt-4">
                <div className="text-sm text-gray-700 font-medium mb-2">
                  Available Time Slots
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((s) => {
                    const active = selectedSlot === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSlot(s)}
                        className={`py-2 px-2 text-sm rounded-md ${
                          active
                            ? "bg-[#e61717] text-white"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Address & Notes */}
              <div className="mt-4">
                <label className="text-sm text-gray-600">Service Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no, Street, Landmark"
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="mt-3">
                <label className="text-sm text-gray-600">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any instructions for the professional"
                  className="w-full mt-2 px-3 py-2 border rounded-lg h-20"
                />
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={confirmBooking}
                  className="flex-1 bg-[#e61717] text-white py-3 rounded-lg font-semibold hover:bg-[#c91313]"
                >
                  Confirm & Pay {currency(worker.price || 0)}
                </button>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 border rounded-lg py-3"
                >
                  Cancel
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-3">
                By confirming you agree to the terms of service.
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
