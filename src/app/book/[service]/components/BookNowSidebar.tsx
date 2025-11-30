"use client";
import React from "react";
import { Worker } from "../types";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";

interface BookNowSidebarProps {
  service: string;
  filteredWorkers: Worker[];
}

export const BookNowSidebar: React.FC<BookNowSidebarProps> = ({
  service,
  filteredWorkers,
}) => {
  return (
    <div className="lg:col-span-4 sticky top-28 self-start flex flex-col gap-4">
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=1000&q=80"
            alt="service"
            className="w-20 h-20 object-cover rounded-xl"
          />
          <div>
            <h3 className="text-lg font-semibold capitalize">
              {service.replace("-", " ")}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Trusted professionals for quick and reliable service at your
              doorstep.
            </p>
          </div>
        </div>

        <div className="mt-4 border-t pt-4 text-sm text-gray-600 space-y-2">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-[#3b82f6]" />
            <div>Verified professionals</div>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-[#10b981]" />
            <div>Background checked</div>
          </div>
          <div className="mt-3 text-sm text-gray-700">
            <strong>{filteredWorkers.length}</strong> professionals available
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border shadow-sm text-sm">
        <div className="font-semibold mb-2">How it works</div>
        <ol className="list-decimal ml-5 space-y-1 text-gray-600">
          <li>Choose a professional</li>
          <li>Pick date & slot</li>
          <li>Confirm booking — done!</li>
        </ol>
      </div>
    </div>
  );
};
