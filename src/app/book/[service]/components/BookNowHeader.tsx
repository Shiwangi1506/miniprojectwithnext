"use client";
import React from "react";
import { FaSearch, FaMapMarkerAlt, FaGlobe, FaList } from "react-icons/fa";

interface BookNowHeaderProps {
  service: string;
  filteredCount: number;
  search: string;
  setSearch: (val: string) => void;
  place: string;
  setPlace: (val: string) => void;
  mapView: boolean;
  setMapView: (val: boolean) => void;
}

export const BookNowHeader: React.FC<BookNowHeaderProps> = ({
  service,
  filteredCount,
  search,
  setSearch,
  place,
  setPlace,
  mapView,
  setMapView,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/60 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center gap-4 justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold capitalize tracking-tight text-gray-800">
            {service.replace("-", " ")}
          </h1>
          <span className="px-2 py-1 text-xs bg-[#eef6ff] text-[#1166cc] rounded-full">
            {filteredCount} pros
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
            onClick={() => setMapView(!mapView)}
            className="ml-2 px-3 py-2 border rounded-full text-sm flex items-center gap-2 bg-white"
            title="Toggle map/List"
          >
            {mapView ? <FaList /> : <FaGlobe />}{" "}
            <span className="hidden sm:inline">{mapView ? "List" : "Map"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
