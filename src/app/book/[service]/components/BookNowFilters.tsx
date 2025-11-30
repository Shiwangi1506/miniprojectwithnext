"use client";
import React from "react";
import { Worker } from "../types";

interface BookNowFiltersProps {
  sortBy: "relevance" | "rating" | "priceLow" | "priceHigh";
  setSortBy: (val: "relevance" | "rating" | "priceLow" | "priceHigh") => void;
  minRating: number;
  setMinRating: (val: number) => void;
  minExperience: number;
  setMinExperience: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  resetFilters: () => void;
}

export const BookNowFilters: React.FC<BookNowFiltersProps> = ({
  sortBy,
  setSortBy,
  minRating,
  setMinRating,
  minExperience,
  setMinExperience,
  maxPrice,
  setMaxPrice,
  resetFilters,
}) => {
  const currency = (n: number) => `₹${n}`;

  return (
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
            onClick={resetFilters}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
