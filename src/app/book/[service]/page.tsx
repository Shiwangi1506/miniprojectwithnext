"use client";

import React, { useState, useMemo, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookNowHeader } from "./components/BookNowHeader";
import { BookNowFilters } from "./components/BookNowFilters";
import { BookNowSidebar } from "./components/BookNowSidebar";
import { WorkerList } from "./components/WorkerList";
import { BookingDrawer } from "./components/BookingDrawer";
import { WorkerDetailsModal } from "./components/WorkerDetailsModal";
import { BookingConfirmationModal } from "./components/BookingConfirmationModal";
import { Worker } from "./types";
import { IService } from "@/models/service";

export default function BookNowPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  // Workers data
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceDetails, setServiceDetails] = useState<IService | null>(null);

  // Filters and UI
  const [search, setSearch] = useState("");
  const [place, setPlace] = useState("");
  const [mapView, setMapView] = useState(false);
  const [sortBy, setSortBy] = useState<
    "relevance" | "rating" | "priceLow" | "priceHigh"
  >("relevance");
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  // 🧩 Separate states for modal and drawer
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null); // for View More modal
  const [bookingWorker, setBookingWorker] = useState<Worker | null>(null); // for Booking drawer

  // Booking drawer states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Confirmation Modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessingBooking, setIsProcessingBooking] = useState(false);

  // Define available time slots
  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  // ✅ Fetch workers by service type
  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/workers/${service}`);
        if (!res.ok) throw new Error("Failed to fetch workers");
        const data = await res.json();
        setWorkers(data.workers || []);
      } catch (error) {
        setWorkers([]); // Ensure workers is empty on error
        console.error("Error fetching workers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchServiceDetails = async () => {
      try {
        const res = await fetch(`/api/services/${service}`);
        if (res.ok) {
          const data = await res.json();
          setServiceDetails(data.service);
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchWorkers();
  }, [service]);

  // Pre-fill address if user is logged in
  useEffect(() => {
    // Assuming the user object in session might have an address
    if (session?.user && (session.user as any).address) {
      setAddress((session.user as any).address);
    }
  }, [session, bookingWorker]); // Rerun if the booking drawer opens

  // ✅ Filter logic
  const filteredWorkers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workers
      .filter((w) => {
        const matchesQ =
          !q ||
          w.name?.toLowerCase().includes(q) ||
          w.skills?.join(",").toLowerCase().includes(q) ||
          w.location?.city?.toLowerCase().includes(q);
        const matchesPlace =
          !place ||
          w.location?.city?.toLowerCase().includes(place.toLowerCase());
        const matchesExp = (w.experience || 0) >= minExperience;
        return matchesQ && matchesPlace && matchesExp;
      })
      .sort((a, b) => (b.experience || 0) - (a.experience || 0));
  }, [workers, search, place, minExperience]);

  // ✅ Confirm Booking
  const confirmBooking = () => {
    const missingFields = [];
    if (!selectedDate) missingFields.push("date");
    if (!selectedSlot) missingFields.push("time slot");
    if (!address.trim()) missingFields.push("address");

    if (missingFields.length > 0) {
      alert(
        `Please provide the following information: ${missingFields.join(", ")}.`
      );
      return;
    }

    if (session) {
      // Open the confirmation modal instead of redirecting
      setIsConfirmModalOpen(true);
    } else {
      router.push("/login");
    }
  };

  // ✅ Handle Final Booking Submission
  const handleFinalBooking = async () => {
    if (!bookingWorker || !selectedDate || !selectedSlot || !address) {
      alert("Booking details are incomplete.");
      return;
    }

    setIsProcessingBooking(true);

    try {
      const bookingDetails = {
        workerId: bookingWorker._id,
        price: bookingWorker.price,
        date: selectedDate.toISOString(),
        slot: selectedSlot,
        address,
        notes,
        service,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed.");

      alert("Booking successful!");

      // Close all modals and reset state
      setIsConfirmModalOpen(false);
      setBookingWorker(null);
      setSelectedDate(null);
      setSelectedSlot(null);
      setAddress("");
      setNotes("");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setIsProcessingBooking(false);
    }
  };

  // ✅ Reset Filters
  const resetFilters = () => {
    setSearch("");
    setPlace("");
    setMinExperience(0);
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f9fc] to-white">
      {/* Header */}
      <BookNowHeader
        service={service}
        filteredCount={filteredWorkers.length}
        search={search}
        setSearch={setSearch}
        place={place}
        setPlace={setPlace}
        mapView={mapView}
        setMapView={setMapView}
      />

      {/* Filters */}
      <BookNowFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        minRating={minRating}
        setMinRating={setMinRating}
        minExperience={minExperience}
        setMinExperience={setMinExperience}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        resetFilters={resetFilters}
      />

      {/* Worker list and sidebar */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <BookNowSidebar
          service={service}
          serviceDetails={serviceDetails}
          filteredWorkers={filteredWorkers}
        />
        <main className="lg:col-span-8">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading professionals...</p>
            </div>
          ) : !mapView && workers.length === 0 ? (
            <div className="text-center py-10 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-800">
                Service Currently Unavailable
              </h3>
              <p className="text-yellow-700 mt-2">
                We're sorry, but there are currently no professionals available
                for this service.
              </p>
            </div>
          ) : !mapView ? (
            <WorkerList
              workers={filteredWorkers}
              onBook={(worker) => setBookingWorker(worker)}
              onViewDetails={(worker) => setSelectedWorker(worker)}
            />
          ) : null}
        </main>
      </div>

      {/* View More Modal */}
      <WorkerDetailsModal
        worker={selectedWorker}
        open={!!selectedWorker}
        onClose={() => setSelectedWorker(null)}
        onBook={(worker) => {
          setSelectedWorker(null);
          setBookingWorker(worker);
        }}
      />

      {/* Booking Drawer */}
      <BookingDrawer
        worker={bookingWorker}
        drawerOpen={!!bookingWorker}
        setDrawerOpen={(val) => {
          if (!val) setBookingWorker(null);
        }}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        address={address}
        setAddress={setAddress}
        notes={notes}
        setNotes={setNotes}
        confirmBooking={confirmBooking}
        timeSlots={timeSlots} // Pass the time slots to the drawer
      />

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleFinalBooking}
        isProcessing={isProcessingBooking}
        bookingDetails={{
          worker: bookingWorker,
          date: selectedDate,
          slot: selectedSlot,
          address: address,
        }}
      />
    </div>
  );
}
