"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Metric {
  name: string;
  value: number;
  [key: string]: string | number;
}

const COLORS = ["#e61717", "#3baaff", "#00c49f"];

export default function LivePieChart() {
  const [performanceData, setPerformanceData] = useState<Metric[]>([
    { name: "Booking Rate", value: 0 },
    { name: "Active Usage", value: 0 },
    { name: "Service Quality", value: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData([
        { name: "Booking Rate", value: Math.floor(Math.random() * 50) + 50 },
        { name: "Active Usage", value: Math.floor(Math.random() * 70) + 30 },
        { name: "Service Quality", value: Math.floor(Math.random() * 80) + 20 },
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const renderLabel = useCallback((entry: any) => {
    const name = entry?.name ?? "";
    const value = entry?.value ?? "";
    return `${name}: ${value}%`;
  }, []);

  return (
    <div className="w-full h-[300px] text-white">
      <h2 className="text-lg font-semibold mb-3 text-white">
        Worker Performance Overview
      </h2>

      <div className="bg-[#121212] rounded-2xl p-4 border border-gray-800 shadow-lg hover:shadow-red-500/20 transition-all duration-500">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={performanceData}
              cx="50%"
              cy="50%"
              outerRadius={70} // 🔹 reduced size
              fill="#8884d8"
              dataKey="value"
              label={renderLabel}
              animationDuration={1000}
              isAnimationActive={true}
            >
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Legend
              wrapperStyle={{
                color: "#ccc",
                fontSize: "0.85rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
