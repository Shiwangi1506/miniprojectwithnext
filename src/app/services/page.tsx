"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBolt,
  FaBroom,
  FaTools,
  FaPaintRoller,
  FaShower,
  FaMusic,
  FaSprayCan,
  FaSnowflake,
  FaUtensils,
  FaSpa,
  FaPallet,
  FaChalkboardTeacher,
  FaTint,
  FaTemperatureLow,
} from "react-icons/fa";
import { FaScissors } from "react-icons/fa6";

const services = [
  {
    title: "Electrician",
    slug: "electrician",
    description: "Wiring, repairs & reliable electrical installations.",
    icon: <FaBolt className="text-[#e61717] text-5xl" />,
  },
  {
    title: "House Cleaning",
    slug: "house-cleaning",
    description: "Professional cleaning for your home & office.",
    icon: <FaBroom className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Carpenter",
    slug: "carpenter",
    description: "Furniture repair, assembly, and custom woodwork.",
    icon: <FaTools className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Painter",
    slug: "painter",
    description: "Interior & exterior painting with top quality finish.",
    icon: <FaPaintRoller className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Plumber",
    slug: "plumber",
    description: "Leak fixes, installations & full plumbing solutions.",
    icon: <FaShower className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Dancer",
    slug: "dancer",
    description: "Classical Indian, Hip-hop, freestyle & more styles.",
    icon: <FaMusic className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Maids",
    slug: "maids",
    description: "Deep cleaning, dusting, and mopping made easy.",
    icon: <FaSprayCan className="text-[#e61717] text-5xl" />,
  },
  {
    title: "AC Repairers",
    slug: "ac-repairers",
    description: "Filter cleaning, thermostat checks & gas refill.",
    icon: <FaSnowflake className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Fridge Repairer",
    slug: "fridge-repairer",
    description: "Fixes cooling issues & replaces faulty parts.",
    icon: <FaTemperatureLow className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Cooks",
    slug: "cooks",
    description: "Prepares meals & ensures hygienic delicious food.",
    icon: <FaUtensils className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Beauticians",
    slug: "beauticians",
    description: "Hair, skin & makeup treatments by professionals.",
    icon: <FaSpa className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Tailors",
    slug: "tailors",
    description: "Alterations, custom fits & fashion stitching.",
    icon: <FaScissors className="text-[#e61717] text-5xl" />,
  },
  {
    title: "RO Technicians",
    slug: "ro-technicians",
    description: "Installs & repairs water purification systems.",
    icon: <FaTint className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Tutors",
    slug: "tutors",
    description: "Personalized lessons to help students excel.",
    icon: <FaChalkboardTeacher className="text-[#e61717] text-5xl" />,
  },
  {
    title: "Decorators",
    slug: "decorators",
    description: "Decorates events & spaces beautifully.",
    icon: <FaPallet className="text-[#e61717] text-5xl" />,
  },
];

const exampleSearches = [
  "Electrician near me",
  "Home Cleaning Service",
  "AC Repair Expert",
  "Painter for House Walls",
  "Personal Cook",
  "Event Decorator",
];

export default function ServicesPage() {
  const [searchText, setSearchText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [typingForward, setTypingForward] = useState(true);

  useEffect(() => {
    const currentExample = exampleSearches[exampleIndex];
    let timer: NodeJS.Timeout;

    if (typingForward) {
      timer = setTimeout(() => {
        if (displayedText.length < currentExample.length) {
          setDisplayedText(currentExample.slice(0, displayedText.length + 1));
        } else {
          setTypingForward(false);
        }
      }, 100);
    } else {
      timer = setTimeout(() => {
        if (displayedText.length > 0) {
          setDisplayedText(currentExample.slice(0, displayedText.length - 1));
        } else {
          setTypingForward(true);
          setExampleIndex((prev) => (prev + 1) % exampleSearches.length);
        }
      }, 60);
    }

    return () => clearTimeout(timer);
  }, [displayedText, typingForward, exampleIndex]);

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f9fc] to-white">
      {/* Header Section */}
      <section className="text-center py-16 bg-gradient-to-r from-[#a8c6d8] to-white shadow-inner">
        <h1 className="text-4xl font-bold text-gray-800">Our Services</h1>
        <p className="text-gray-700 mt-3 max-w-2xl mx-auto">
          Choose from trusted professionals near you — fast, reliable, and
          affordable service at your doorstep.
        </p>

        <div className="mt-8 flex justify-center">
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.input
              type="text"
              placeholder={displayedText || "Search for a service..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-[#c3d3e0] shadow-lg focus:outline-none focus:ring-2 focus:ring-[#e61717]/80 text-gray-800 text-lg placeholder-gray-400 transition-all duration-300"
              whileFocus={{ scale: 1.02 }}
            />
            <motion.span
              className="absolute right-5 top-3 text-[#e61717] text-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🔍
            </motion.span>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-8 text-center border border-gray-200 hover:border-[#a8c6d8]/80 transition-all shadow-sm hover:shadow-xl overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-[#a8c6d8]/70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10 flex justify-center">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold mt-6 text-gray-800">
                {service.title}
              </h2>
              <p className="text-gray-600 mt-3">{service.description}</p>

              <Link href={`/book/${service.slug}`}>
                <button className="mt-6 bg-black text-white px-6 py-2 rounded-full hover:bg-[#e61717] transition-all">
                  Book Now
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
