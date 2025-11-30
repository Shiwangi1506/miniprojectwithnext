"use client";
import React from "react";
import { Worker } from "../types";
import { FaCheckCircle, FaStar, FaBriefcase } from "react-icons/fa";

interface WorkerCardProps {
  worker: Worker;
  onBook: (w: Worker) => void;
  onViewDetails: (w: Worker) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onBook,
  onViewDetails,
}) => {
  // ✅ fallback image
  const avatarSrc = worker.avatar || "/default-avatar.jpg";

  // ✅ use real fields safely
  const name = worker.name || "Unnamed Worker";
  const city = worker.location?.city || "Unknown City";
  const description = worker.description || "No description provided.";
  const experience = worker.experience ?? 0;
  const skills = worker.skills || [];
  const verified = worker.verified ?? false;

  return (
    <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
      {/* Avatar */}
      <div className="relative">
        <img src={avatarSrc} alt={name} className="w-full h-52 object-cover" />

        {verified && (
          <div className="absolute left-4 top-4 bg-white/90 px-2 py-1 rounded-full text-xs text-green-600 flex items-center gap-1">
            <FaCheckCircle /> Verified
          </div>
        )}
      </div>

      {/* Worker Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-gray-800">{name}</h4>
            <p className="text-sm text-gray-500 mt-1">{city}</p>

            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <FaBriefcase className="text-gray-400" />
              <span>
                {experience} year{experience !== 1 ? "s" : ""} experience
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{description}</p>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onViewDetails(worker)}
            className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            View Details
          </button>

          <button
            onClick={() => onBook(worker)}
            className="flex-1 py-2 bg-[#e61717] text-white rounded-lg text-sm hover:bg-[#c91313]"
          >
            Book
          </button>
        </div>
      </div>
    </article>
  );
};
