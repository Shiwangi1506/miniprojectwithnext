"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface WorkerCardProps {
  worker: any;
  service: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, service }) => {
  const router = useRouter();

  return (
    <div
      className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-xl transition transform hover:scale-105"
      onClick={() => router.push(`/book/${service}/worker/${worker._id}`)}
    >
      <img
        src={worker.image || "/default-worker.png"}
        alt={worker.name}
        className="w-full h-36 object-cover rounded-xl mb-2"
      />
      <h2 className="text-lg font-semibold">{worker.name}</h2>
      <p className="text-gray-600 text-sm">{worker.skills.join(", ")}</p>
      <p className="text-gray-700 text-sm">
        Experience: {worker.experience} years
      </p>
      <p className="text-[#e61717] font-semibold">₹{worker.price}</p>
      <p className="text-gray-500 text-sm">{worker.location.city}</p>
    </div>
  );
};

export default WorkerCard;
