"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  User,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const navItems = [
    {
      name: "Dashboard",
      href: "/worker-dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Bookings",
      href: "/worker-booking",
      icon: <CalendarCheck size={20} />,
    },
    { name: "Earnings", href: "#", icon: <Wallet size={20} /> }, // Placeholder
    { name: "Profile", href: "#", icon: <User size={20} /> }, // Placeholder
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex-col hidden md:flex">
      <div className="p-6 text-2xl font-bold border-b border-gray-700 text-center">
        <Link href="/worker-dashboard">UrbanSetGo</Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
