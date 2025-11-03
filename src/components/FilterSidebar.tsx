"use client";

interface Props {
  minPrice: number;
  setMinPrice: (v: number) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  city: string;
  setCity: (v: string) => void;
  rating: number;
  setRating: (v: number) => void;
  availability: string;
  setAvailability: (v: string) => void;
  applyFilters: () => void;
}

export default function FilterSidebar({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  city,
  setCity,
  rating,
  setRating,
  availability,
  setAvailability,
  applyFilters,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-gray-600">Price Range (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-[#e61717] outline-none"
            placeholder="Min"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-lg focus:ring-2 focus:ring-[#e61717] outline-none"
            placeholder="Max"
          />
        </div>
      </div>

      {/* City */}
      <div className="space-y-1">
        <label className="text-gray-600">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#e61717] outline-none"
          placeholder="Enter city"
        />
      </div>

      {/* Rating */}
      <div className="space-y-1">
        <label className="text-gray-600">Minimum Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#e61717] outline-none"
        >
          <option value={0}>Any</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
          <option value={5}>5</option>
        </select>
      </div>

      {/* Availability */}
      <div className="space-y-1">
        <label className="text-gray-600">Availability</label>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#e61717] outline-none"
        >
          <option value="">Any</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={applyFilters}
        className="w-full py-2 bg-[#e61717] text-white rounded-lg hover:bg-black transition"
      >
        Apply Filters
      </button>
    </div>
  );
}
