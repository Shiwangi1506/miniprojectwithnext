"use client";

import { Home, Wallet, User, Settings, LogOut, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  // ✅ Only runs in browser
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width < 1024 && width >= 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menu = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <Wallet size={20} />, label: "Earnings" },
    { icon: <User size={20} />, label: "Profile" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  const handleMenuClick = (label: string) => {
    setActive(label);
    if (windowWidth && windowWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {/* 🔹 Mobile Toggle Button */}
      <button
        className={`md:hidden fixed top-5 left-5 z-50 p-2 rounded-md shadow-md transition-all duration-300
          ${
            isOpen
              ? "bg-white text-[#e61717] border border-[#e61717]"
              : "bg-[#e61717] text-white border border-transparent"
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* 🔹 Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{
          x: windowWidth && windowWidth < 768 ? (isOpen ? 0 : -300) : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed md:static top-0 left-0 h-screen md:h-auto 
          bg-[#0f0f0f] text-gray-200 border-r border-gray-800 
          flex flex-col justify-between p-6 z-40 
          shadow-[4px_0_20px_rgba(0,0,0,0.4)]
          ${isCollapsed ? "w-20" : "w-64"} 
          transition-all duration-300`}
      >
        {/* 🔸 Menu Items */}
        <div className="flex flex-col gap-6 mt-10">
          {menu.map((item, i) => {
            const isActive = active === item.label;
            return (
              <motion.div
                key={i}
                onClick={() => handleMenuClick(item.label)}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md transition-all
                  ${
                    isActive
                      ? "bg-[#e61717]/20 text-[#e61717]"
                      : "hover:bg-[#1a1a1a] hover:text-[#e61717] text-gray-300"
                  }`}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* 🔸 Logout Button */}
        <div
          className={`flex items-center gap-3 cursor-pointer hover:text-[#e61717] transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </div>
      </motion.aside>

      {/* 🔹 Overlay (click to close) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
