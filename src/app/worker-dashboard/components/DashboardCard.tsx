"use client";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  icon: string;
}

export default function DashboardCard({ title, icon }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:border-[#e61717] transition-all duration-300"
      animate={{ borderColor: ["#e61717", "#ffffff", "#e61717"] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-base font-semibold text-gray-900">{title}</p>
    </motion.div>
  );
}
