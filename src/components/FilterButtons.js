// src/components/FilterButtons.js
import React from "react";

const FILTERS = ["All", "Active", "Completed"];

export default function FilterButtons({ currentFilter, onChange }) {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1 rounded-lg transition ${
            currentFilter === f
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
