"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Worker = {
  id: string;
  name: string;
  rating: number;
  price: number;
  location: string;
  description: string;
  skills: string[];
};

function getInitial(name: string) {
  return name ? name[0].toUpperCase() : "U";
}

// ✅ FIXED FUNCTION SIGNATURE BELOW
export default function BookServicePage({
  params,
}: {
  params: Promise<{ service: string }>; // now params is a Promise
}) {
  const { service } = React.use(params); // ✅ unwrap the Promise

  const router = useRouter();

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "11:00 AM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
    "07:00 PM",
  ];

  // Mock data (you can later replace with fetch from API)
  useEffect(() => {
    const mockData: Record<string, Worker[]> = {
      plumber: [
        {
          id: "w1",
          name: "Ramesh Kumar",
          rating: 4.6,
          price: 450,
          location: "Sector 12",
          description: "Expert in plumbing and repairs.",
          skills: ["Plumbing", "Leak Fixing"],
        },
        {
          id: "w2",
          name: "Suresh Patel",
          rating: 4.8,
          price: 500,
          location: "Old Market",
          description: "Professional plumber with 5+ years of experience.",
          skills: ["Piping", "Faucet Installation"],
        },
      ],
      electrician: [
        {
          id: "w3",
          name: "Sonia Sharma",
          rating: 4.7,
          price: 600,
          location: "MG Road",
          description: "All-round electrician for homes and offices.",
          skills: ["Electrical", "Wiring"],
        },
      ],
      carpenter: [
        {
          id: "w4",
          name: "Aman Verma",
          rating: 4.2,
          price: 350,
          location: "Hinjewadi",
          description: "Carpentry and furniture repair expert.",
          skills: ["Furniture", "Polishing"],
        },
      ],
    };

    setWorkers(mockData[service] || []);
  }, [service]);

  const confirmBooking = async () => {
    if (!selectedWorker) {
      alert("Please select a worker first!");
      return;
    }
    if (!date || !timeSlot) {
      alert("Please select a date and time slot.");
      return;
    }
    if (!city || !country) {
      alert("Please enter your location details.");
      return;
    }

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId: selectedWorker.id,
          service,
          date,
        }),
      });

      // check if server responded with valid JSON
      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        throw new Error("Booking failed");
      }

      const data = await res.json();
      console.log("Booking success:", data);

      setBookingSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    }
  };


  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold capitalize">
              {service.replace(/-/g, " ")}
            </h1>
            <p className="text-gray-600">
              Choose a worker and book your service below.
            </p>
          </div>
          <Link
            href="/services"
            className="px-4 py-2 bg-[#e61717] text-white rounded-md hover:bg-black font-medium transition-all"
          >
            ← Back to Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Worker List */}
          <div className="lg:col-span-2 space-y-4">
            {workers.length === 0 ? (
              <div className="text-gray-500">No workers available yet.</div>
            ) : (
              workers.map((w) => (
                <div
                  key={w.id}
                  className={`border rounded-lg p-4 flex items-center justify-between shadow-sm transition-all ${
                    selectedWorker?.id === w.id ? "border-[#e61717]" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-lg">
                      {getInitial(w.name)}
                    </div>
                    <div>
                      <div className="font-semibold">{w.name}</div>
                      <div className="text-sm text-gray-600">
                        {w.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {w.skills.join(", ")} • {w.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-medium text-lg">₹{w.price}</div>
                    <button
                      onClick={() => setSelectedWorker(w)}
                      className="px-4 py-2 bg-[#000000] text-white rounded-md hover:bg-[#e61717]"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Form */}
          <aside className="border rounded-lg p-4 shadow-sm">
            {!selectedWorker ? (
              <div className="text-center text-gray-500">
                Select a worker to continue booking.
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Booking with {selectedWorker.name}
                </h2>

                <div>
                  <label className="text-sm font-medium">Select Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Select Time Slot
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeSlot(t)}
                        className={`px-3 py-2 rounded-md border ${
                          timeSlot === t
                            ? "bg-black text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md mt-1"
                    placeholder="Enter your city"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Country</label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md mt-1"
                    placeholder="Enter your country"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border px-3 py-2 rounded-md mt-1"
                    placeholder="Any special requests?"
                  />
                </div>

                <button
                  onClick={confirmBooking}
                  className="w-full bg-[#e61717] text-white py-2 rounded-md hover:bg-[#000000] font-medium"
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* Booking Success Message */}
        {bookingSuccess && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-green-600 text-5xl mb-2">✔</div>
              <div className="text-lg font-semibold">Booking Successful!</div>
              <div className="text-sm text-gray-600">
                Redirecting to your profile...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
