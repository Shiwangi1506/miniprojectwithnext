"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const userRole = (session?.user as { role?: string })?.role;
  const dashboardHref =
    userRole === "user" ? "/user-dashboard" : "/worker-dashboard";

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
  ];

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#262626] text-white relative">
      <div className="text-2xl font-bold">UrbanSetGo</div>

      <ul className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <li key={item.name} className="relative group">
            <Link
              href={item.href}
              className="inline-block relative pb-1 text-white"
            >
              {item.name}
              <span className="absolute bottom-0 h-[2px] w-0 left-1/2 bg-[#e61717] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
            </Link>
          </li>
        ))}
        {session ? (
          <>
            <li className="relative group">
              <Link
                href={dashboardHref}
                className="inline-block relative pb-1 text-white"
              >
                Dashboard
                <span className="absolute bottom-0 h-[2px] w-0 left-1/2 bg-[#e61717] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
              </Link>
            </li>
            <li className="relative group">
              <button
                onClick={() => signOut()}
                className="inline-block relative pb-1 text-white bg-transparent border-none cursor-pointer"
              >
                Logout
                <span className="absolute bottom-0 h-[2px] w-0 left-1/2 bg-[#e61717] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
              </button>
            </li>
          </>
        ) : (
          <li className="relative group">
            <Link
              href="/login"
              className="inline-block relative pb-1 text-white"
            >
              Login
              <span className="absolute bottom-0 h-[2px] w-0 left-1/2 bg-[#e61717] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
            </Link>
          </li>
        )}
      </ul>

      <button
        className="block md:hidden text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "☰"}
      </button>

      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-[#1e1e1e] flex flex-col items-center space-y-4 py-4 md:hidden z-10">
          {navItems.map((item) => (
            <li key={item.name} className="relative group">
              <Link
                href={item.href}
                className="inline-block relative pb-1 text-white"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
                <span className="absolute bottom-0 h-[2px] w-0 left-1/2 bg-[#e61717] transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0"></span>
              </Link>
            </li>
          ))}
          {session ? (
            <>
              <li className="relative group">
                <Link
                  href={dashboardHref}
                  className="inline-block relative pb-1 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="inline-block relative pb-1 text-white bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
