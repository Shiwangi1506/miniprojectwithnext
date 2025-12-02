"use client";
import React from "react";
import { Worker } from "../types";
import { IService } from "@/models/service";
import { FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import {
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Scissors,
  Sparkles,
  PersonStanding,
  type LucideProps,
} from "lucide-react";

interface BookNowSidebarProps {
  service: string;
  serviceDetails: IService | null;
  filteredWorkers: Worker[];
}

const serviceIconMap: Record<string, React.FC<LucideProps>> = {
  plumber: Wrench,
  electrician: Zap,
  painter: Paintbrush,
  carpenter: Hammer,
  tailor: Scissors,
  "house-cleaning": Sparkles,
  dancer: PersonStanding,
};

const getServiceIcon = (serviceSlug: string) => {
  const Icon = serviceIconMap[serviceSlug.toLowerCase()];
  // Return a default icon if no specific one is found
  return Icon ? <Icon size={32} /> : <Wrench size={32} />;
};

export const BookNowSidebar: React.FC<BookNowSidebarProps> = ({
  service,
  serviceDetails,
  filteredWorkers,
}) => {
  return (
    <div className="lg:col-span-4 sticky top-28 self-start flex flex-col gap-4">
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 flex items-center justify-center bg-[#e61717]/10 text-[#e61717] rounded-xl">
            {getServiceIcon(service)}
          </div>

          <div>
            <h3 className="text-lg font-semibold capitalize">
              {serviceDetails?.name || service.replace("-", " ")}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {serviceDetails?.description ||
                "Trusted professionals for quick and reliable service."}
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
