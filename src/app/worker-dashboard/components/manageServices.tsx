"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, X, Trash2 } from "lucide-react";

export default function ManageServicesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [services, setServices] = useState([
    { id: 1, name: "AC Repair", price: 499, active: true },
    { id: 2, name: "House Cleaning", price: 799, active: false },
    { id: 3, name: "Plumbing", price: 599, active: true },
  ]);

  const [newService, setNewService] = useState({ name: "", price: "" });

  if (!isOpen) return null;

  const toggleService = (id: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name.trim() || !newService.price) return;

    setServices((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newService.name.trim(),
        price: parseInt(newService.price),
        active: true,
      },
    ]);

    setNewService({ name: "", price: "" });
  };

  const removeService = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="bg-[#121212] text-white border border-gray-700 rounded-2xl w-[90%] max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-red-500">
            ⚙️ Manage Services
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Service List */}
        <div className="space-y-3 mb-6">
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex justify-between items-center bg-[#1a1a1a] border rounded-lg px-4 py-3 ${
                service.active ? "border-red-600" : "border-gray-700"
              }`}
            >
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-gray-400">₹{service.price}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleService(service.id)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    service.active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {service.active ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => removeService(service.id)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}

          {services.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No services added yet.
            </p>
          )}
        </div>

        {/* Add New Service */}
        <form
          onSubmit={handleAddService}
          className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 space-y-4"
        >
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-red-400">
            <PlusCircle size={18} /> Add New Service
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              className="bg-[#0e0e0e] border border-gray-700 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
            />
            <input
              placeholder="Price (₹)"
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
              className="bg-[#0e0e0e] border border-gray-700 rounded-lg px-3 py-2 focus:border-red-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-2 mt-3 transition"
          >
            Add Service
          </button>
        </form>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
