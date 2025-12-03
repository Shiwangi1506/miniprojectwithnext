"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();

  if (!open) return null;

  const handleNavigate = () => {
    onClose();
    router.push("/booking");
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm text-center p-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Booking Confirmed!
        </h2>
        <p className="mt-2 text-gray-600">
          Your booking has been successfully submitted. You can view its status
          on your bookings page.
        </p>
        <button
          onClick={handleNavigate}
          className="mt-6 w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};
