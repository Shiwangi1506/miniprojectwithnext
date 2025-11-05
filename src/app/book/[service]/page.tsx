"use client";

import React, { use } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaShieldAlt,
  FaCheckCircle,
  FaGlobe,
  FaList,
} from "react-icons/fa";

/**
 * Enhanced Urban Company–style Book Now page (single file)
 *
 * Notes:
 * - Unwrap `params` with React.use() for Next.js 15+ App Router.
 * - Map view uses a placeholder box — replace with a map component (Google/Mapbox) later.
 * - Booking drawer slides from right and contains calendar + slot selector.
 */

/* ------------------ Mock data ------------------ */
type Worker = {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  experienceYears: number;
  jobs: number;
  location: string;
  price: number;
  avatar: string;
  bio: string;
  topRated?: boolean;
  verified?: boolean;
  slots: string[]; // available times (strings like "10:00")
};

const MOCK_WORKERS: Worker[] = [
  {
    id: 1,
    name: "Ravi Sharma",
    rating: 4.8,
    reviews: 134,
    experienceYears: 5,
    jobs: 420,
    location: "Hauz Khas, New Delhi",
    price: 499,
    avatar:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=800&q=80",
    bio: "Reliable electrician — wiring, fittings & small installs. Fast & neat.",
    topRated: true,
    verified: true,
    slots: ["09:00", "10:30", "12:00", "14:00", "16:00"],
  },
  {
    id: 2,
    name: "Amit Verma",
    rating: 4.6,
    reviews: 89,
    experienceYears: 3,
    jobs: 210,
    location: "Sector 62, Noida",
    price: 399,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&q=80",
    bio: "Friendly cleaner — deep-clean & quick turnaround. Client favourite.",
    verified: true,
    slots: ["10:00", "11:30", "13:00", "15:00"],
  },
  {
    id: 3,
    name: "Suresh Kumar",
    rating: 4.9,
    reviews: 210,
    experienceYears: 7,
    jobs: 680,
    location: "MG Road, Gurgaon",
    price: 599,
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&q=80",
    bio: "Expert technician — complex problems, reliable and neat.",
    topRated: true,
    verified: true,
    slots: ["09:30", "11:00", "12:30", "15:30"],
  },
  {
    id: 4,
    name: "Neha Singh",
    rating: 4.7,
    reviews: 76,
    experienceYears: 4,
    jobs: 190,
    location: "Connaught Place, Delhi",
    price: 449,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    bio: "Skilled in finishes and attentive cleaning. Always on time.",
    verified: true,
    slots: ["09:00", "11:00", "13:30", "17:00"],
  },
];

/* ------------------ Utilities ------------------ */
const currency = (n: number) => `₹${n}`;

/* small toast */
function toast(message: string) {
  const id = "usg-toast";
  let el = document.getElementById(id) as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.style.position = "fixed";
    el.style.bottom = "28px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.padding = "10px 16px";
    el.style.borderRadius = "999px";
    el.style.background = "rgba(17,24,39,0.92)";
    el.style.color = "white";
    el.style.zIndex = "9999";
    el.style.fontSize = "14px";
    el.style.opacity = "0";
    el.style.transition = "opacity .25s";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.opacity = "1";
  setTimeout(() => {
    el && (el.style.opacity = "0");
  }, 2600);
}

/* Generate next 14 days for quick slot UI */
function getNextDays(n = 14) {
  const arr: Date[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    arr.push(d);
  }
  return arr;
}

/* Format like "Sat, 12 Jul" */
function formatShortDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* ------------------ Main Page ------------------ */

export default function BookNowPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  // Next.js 15+ — unwrap params
  const { service } = use(params);

  // UI states
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState("");
  const [mapView, setMapView] = useState(false);
  const [sortBy, setSortBy] = useState<
    "relevance" | "rating" | "priceLow" | "priceHigh"
  >("relevance");

  // filter controls
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  // selection & booking drawer
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // compact next-days list
  const nextDays = useMemo(() => getNextDays(14), []);

  // filter & sort pipeline
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = MOCK_WORKERS.filter((w) => {
      const matchesQ =
        !q ||
        w.name.toLowerCase().includes(q) ||
        w.bio.toLowerCase().includes(q) ||
        w.location.toLowerCase().includes(q);
      const matchesPlace =
        !place || w.location.toLowerCase().includes(place.toLowerCase());
      const matchesRating = w.rating >= minRating;
      const matchesExp = w.experienceYears >= minExperience;
      const matchesPrice = w.price <= maxPrice;
      return (
        matchesQ && matchesPlace && matchesRating && matchesExp && matchesPrice
      );
    });

    if (sortBy === "rating") arr = arr.sort((a, b) => b.rating - a.rating);
    if (sortBy === "priceLow") arr = arr.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") arr = arr.sort((a, b) => b.price - a.price);
    if (sortBy === "relevance") arr = arr.sort((a, b) => b.jobs - a.jobs);

    return arr;
  }, [search, place, minRating, minExperience, maxPrice, sortBy]);

  useEffect(() => {
    // close drawer if worker deselected
    if (!selectedWorker) {
      setDrawerOpen(false);
      setSelectedDate(null);
      setSelectedSlot(null);
      setAddress("");
      setNotes("");
    }
  }, [selectedWorker]);

  /* booking confirm */
  const confirmBooking = () => {
    if (!selectedDate || !selectedSlot || !address) {
      toast("Please select date, slot and enter address.");
      return;
    }
    // replace with API call
    toast(
      `Booked ${selectedWorker?.name} on ${formatShortDate(
        selectedDate
      )} at ${selectedSlot}`
    );
    // close drawer and reset
    setDrawerOpen(false);
    setSelectedWorker(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setAddress("");
    setNotes("");
  };

  /* when clicking Book on a worker card, open drawer */
  const openBookingFor = (w: Worker) => {
    setSelectedWorker(w);
    setDrawerOpen(true);
    // preselect today or next available date
    setSelectedDate(new Date());
    setSelectedSlot(w.slots?.[0] ?? null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f9fc] to-white">
      {/* sticky header — glass effect on scroll */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/60 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center gap-4 justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold capitalize tracking-tight text-gray-800">
              {service.replace("-", " ")}
            </h1>
            <span className="px-2 py-1 text-xs bg-[#eef6ff] text-[#1166cc] rounded-full">
              {filtered.length} pros
            </span>
          </div>

          <div className="flex items-center gap-3 w-full max-w-2xl justify-end">
            <div className="relative flex-1 hidden md:block">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for professionals, e.g. 'wiring' or 'deep clean'"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#e61717]"
              />
            </div>

            <div className="relative w-56">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Location (city or area)"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-[#e61717]"
              />
            </div>

            <button
              onClick={() => setMapView((s) => !s)}
              className="ml-2 px-3 py-2 border rounded-full text-sm flex items-center gap-2 bg-white"
              title="Toggle map/List"
            >
              {mapView ? <FaList /> : <FaGlobe />}{" "}
              <span className="hidden sm:inline">
                {mapView ? "List" : "Map"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* top filters row (visible on wide screens) */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="relevance">Recommended</option>
              <option value="rating">Best Rated</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Min Rating</label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.1}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-40"
            />
            <div className="text-sm text-gray-700">{minRating.toFixed(1)}★</div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Min Exp</label>
            <input
              type="number"
              min={0}
              max={30}
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded text-sm"
            />
            <span className="text-sm text-gray-500">yrs</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <label className="text-sm text-gray-600">Max Price</label>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-56"
            />
            <div className="text-sm text-gray-700">{currency(maxPrice)}</div>
            <button
              onClick={() => {
                setSearch("");
                setPlace("");
                setMinRating(0);
                setMinExperience(0);
                setMaxPrice(2000);
                setSortBy("relevance");
              }}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* left column: sidebar (sticky) */}
        <aside className="lg:col-span-4 sticky top-28 self-start">
          <div className="bg-white border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=1000&q=80"
                alt="service"
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {service.replace("-", " ")}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Trusted professionals for quick and reliable service at your
                  doorstep.
                </p>
              </div>
            </div>

            <div className="mt-4 border-t pt-4 text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-[#3b82f6]" />
                <div>Verified professionals</div>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-[#10b981]" />
                <div>Background checked</div>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                <strong>{filtered.length}</strong> professionals available
              </div>
            </div>
          </div>

          {/* small stats or promo */}
          <div className="mt-4 bg-white rounded-2xl p-4 border shadow-sm text-sm">
            <div className="font-semibold mb-2">How it works</div>
            <ol className="list-decimal ml-5 space-y-1 text-gray-600">
              <li>Choose a professional</li>
              <li>Pick date & slot</li>
              <li>Confirm booking — done!</li>
            </ol>
          </div>
        </aside>

        {/* right column: list or map */}
        <main className="lg:col-span-8">
          {/* map view */}
          {mapView ? (
            <div className="h-80 rounded-2xl border border-gray-200 overflow-hidden mb-6">
              {/* placeholder map — replace with real map integration */}
              <div className="w-full h-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center text-gray-600">
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-2">
                    Map view (placeholder)
                  </div>
                  <div className="text-sm">
                    Replace this with Google Maps / Mapbox
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* worker grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((w) => (
              <motion.article
                key={w.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={w.avatar}
                    alt={w.name}
                    className="w-full h-52 object-cover"
                  />
                  {/* badges */}
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {w.topRated && (
                      <span className="bg-yellow-400 text-black px-3 py-1 text-xs rounded-full font-medium">
                        Top Rated
                      </span>
                    )}
                    {w.verified && (
                      <span className="bg-white/90 px-2 py-1 rounded-full text-xs text-green-600 flex items-center gap-1">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{w.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{w.location}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <div className="flex items-center gap-0.5 text-yellow-500">
                          <FaStar />
                          <span className="text-gray-700 ml-1 font-medium">
                            {w.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          • {w.reviews} reviews
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-500">From</div>
                      <div className="text-lg font-semibold text-[#e61717]">
                        {currency(w.price)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {w.bio}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => setSelectedWorker(w)}
                      className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => openBookingFor(w)}
                      className="flex-1 py-2 bg-[#e61717] text-white rounded-lg text-sm hover:bg-[#c91313]"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </main>
      </div>

      {/* Right-side Booking Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedWorker && (
          <>
            {/* overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => {
                setDrawerOpen(false);
                // keep selectedWorker (so user can reopen), or setSelectedWorker(null) to fully close
              }}
            />

            {/* drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] z-50 bg-white shadow-2xl overflow-auto"
            >
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedWorker.avatar}
                    alt={selectedWorker.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div>
                    <div className="text-lg font-semibold">
                      {selectedWorker.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedWorker.location} •{" "}
                      {selectedWorker.experienceYears} yrs
                    </div>
                    <div className="text-sm text-yellow-500 mt-1 flex items-center gap-2">
                      <FaStar />{" "}
                      <span className="text-gray-700">
                        {selectedWorker.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-sm text-gray-700 font-medium mb-2">
                    Choose Date
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {nextDays.slice(0, 7).map((d) => {
                      const iso = d.toISOString().split("T")[0];
                      const isSelected =
                        selectedDate &&
                        selectedDate.toDateString() === d.toDateString();
                      return (
                        <button
                          key={iso}
                          onClick={() => setSelectedDate(d)}
                          className={`py-2 px-2 text-xs rounded-md ${
                            isSelected
                              ? "bg-[#e61717] text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="font-medium">
                            {d.toLocaleDateString("en-IN", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="text-xs">{d.getDate()}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-700 font-medium mb-2">
                      Available Time Slots
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedWorker.slots.map((s) => {
                        const active = selectedSlot === s;
                        return (
                          <button
                            key={s}
                            onClick={() => setSelectedSlot(s)}
                            className={`py-2 px-2 text-sm rounded-md ${
                              active
                                ? "bg-[#e61717] text-white"
                                : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm text-gray-600">
                      Service Address
                    </label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House no, Street, Landmark"
                      className="w-full mt-2 px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="mt-3">
                    <label className="text-sm text-gray-600">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any instructions for the professional"
                      className="w-full mt-2 px-3 py-2 border rounded-lg h-20"
                    />
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={confirmBooking}
                      className="flex-1 bg-[#e61717] text-white py-3 rounded-lg font-semibold hover:bg-[#c91313]"
                    >
                      Confirm & Pay {currency(selectedWorker.price)}
                    </button>
                    <button
                      onClick={() => {
                        setDrawerOpen(false);
                      }}
                      className="flex-1 border rounded-lg py-3"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 mt-3">
                    By confirming you agree to the terms of service.
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
