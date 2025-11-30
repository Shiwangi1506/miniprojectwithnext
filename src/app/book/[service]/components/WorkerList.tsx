"use client";
import React from "react";
import { Worker } from "../types";
import { WorkerCard } from "./WorkerCard";

interface WorkerListProps {
  workers: Worker[];
  onBook: (w: Worker) => void;
  onViewDetails: (w: Worker) => void;
}

export const WorkerList: React.FC<WorkerListProps> = ({
  workers,
  onBook,
  onViewDetails,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {workers.map((w, i) => (
        <WorkerCard
          key={i}
          worker={w}
          onBook={onBook}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
