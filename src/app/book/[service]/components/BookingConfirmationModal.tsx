"use client";

import React from "react";
import { Worker } from "../types";
import { X, Calendar, Clock, MapPin, Loader2 } from "lucide-react";

interface BookingConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: {
    worker: Worker | null;
    date: Date | null;
    slot: string | null;
    address: string;
  };
  isProcessing: boolean;
}

const currency = (n: number) => `₹${n}`;

export const BookingConfirmationModal: React.FC<
  BookingConfirmationModalProps
> = ({ open, onClose, onConfirm, bookingDetails, isProcessing }) => {
  if (
    !open ||
    !bookingDetails.worker ||
    !bookingDetails.date ||
    !bookingDetails.slot
  )
    return null;

  const { worker, date, slot, address } = bookingDetails;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Confirm Your Booking</h2>
          <button
            onClick={onClose}
            className="p-1 disabled:opacity-50"
            disabled={isProcessing}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Please review your booking details for{" "}
            <span className="font-semibold">{worker.name}</span>.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {date.toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{slot}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <span>{address}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold">Total Payable</span>
            <span className="text-xl font-bold text-[#e61717]">
              {currency(worker.price || 0)}
            </span>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full bg-[#e61717] text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ${currency(worker.price || 0)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
