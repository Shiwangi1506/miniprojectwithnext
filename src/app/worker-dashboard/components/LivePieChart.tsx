"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";

interface ChartMetric {
  name: string;
  value: number;
}

const COLORS = ["#e61717", "#3baaff", "#00c49f"];
const BRAND_COLOR = "#e61717";

export default function LivePieChart() {
  const [performanceData, setPerformanceData] = useState<ChartMetric[]>([
    { name: "Booking Rate", value: 0 },
    { name: "Active Usage", value: 0 },
    { name: "Service Quality", value: 0 },
  ]);

  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

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

  const renderLabel = useCallback(
    (props: { name?: string; value?: number }) => {
      if (!props?.name || props?.value === undefined) return "";
      return `${props.name}: ${props.value}%`;
    },
    []
  );

  const renderActiveShape = (props: any) => {
    const outerRadius = (props.outerRadius ?? 88) + 10;
    return <Sector {...props} outerRadius={outerRadius} />;
  };

  return (
    <div className="w-full h-[380px] flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-5 text-gray-900 text-center">
        Worker Performance Overview
      </h2>

      <div
        className="w-full max-w-xl bg-gradient-to-br from-white to-gray-50 
                   border border-gray-200 hover:border-[#e61717]/60
                   shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(230,23,23,0.2)]
                   rounded-xl p-6 transition-all duration-500"
      >
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              {React.createElement(Pie as any, {
                data: performanceData,
                cx: "50%",
                cy: "50%",
                outerRadius: 90,
                innerRadius: 45,
                fill: BRAND_COLOR,
                dataKey: "value",
                label: renderLabel,
                labelLine: false,
                isAnimationActive: true,
                animationDuration: 900,
                onMouseEnter: (_: any, index: number) => setActiveIndex(index),
                onMouseLeave: () => setActiveIndex(undefined),
                activeIndex,
                activeShape: renderActiveShape,
                children: performanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                )),
              })}

              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  border: `1px solid ${BRAND_COLOR}`,
                  borderRadius: "8px",
                  color: "#000",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{
                  color: "#444",
                  fontSize: "0.9rem",
                  marginTop: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
