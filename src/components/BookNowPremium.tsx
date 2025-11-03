"use client";
import React, { useEffect, useState } from "react";

export default function BookNowPremium({ initialService }: { initialService?: any }) {
  // same UI code you already have, but exported as a client component
  // minimal example skeleton (replace with full component from canvas)
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<any>(initialService ?? null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // ... use your full UI code here (the glow, step bar, modal, etc.)
  // keep the `handleConfirm` to call the API below

  async function handleConfirm() {
    // call server API to save booking
    const payload = {
      serviceId: selected?.id,
      serviceName: selected?.name,
      date,
      time,
      address,
      notes,
      price: selected?.price,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setConfirmed(true);
      }, 800);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to place booking — check console.");
    }
  }

  return (
    <div className="min-h-[130vh] font-sans bg-gradient-to-b from-[#0b0b0b] via-[#111111] to-[#161616] text-white">
      {/* paste the rest of your BookNow UI here */}
      <div className="p-6"></div>
    </div>
  );
}
